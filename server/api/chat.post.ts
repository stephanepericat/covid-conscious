import { LangChainAdapter, type Message } from 'ai'
import { ChatOpenAI } from '@langchain/openai'
import { DeepInfraEmbeddings } from "@langchain/community/embeddings/deepinfra";
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { Annotation, MemorySaver, StateGraph } from '@langchain/langgraph'
import type { Document, DocumentInterface } from '@langchain/core/documents'
import { pull } from 'langchain/hub'
import { QdrantVectorStore } from '@langchain/qdrant'
import { SystemMessage, HumanMessage } from '@langchain/core/messages'
import { CallbackHandler } from 'langfuse-langchain'

const config = {
  apiKey: process.env.DEEPINFRA_API_KEY,
  baseUrl: process.env.DEEPINFRA_BASE_URL,
  embedModel: process.env.DEEPINFRA_EMBED_MODEL,
  lfPublicKey: process.env.LANGFUSE_PUBLIC_KEY,
  lfSecretKey: process.env.LANGFUSE_SECRET_KEY,
  lfBaseUrl: process.env.LANGFUSE_BASE_URL,
  llmMaxTokens: parseInt(process.env.DEEPINFRA_LLM_MAX_TOKENS!),
  llmModel: process.env.DEEPINFRA_LLM_MODEL,
  llmTemperature: parseFloat(process.env.DEEPINFRA_LLM_TEMPERATURE!),
  qdrantCollection: process.env.QDRANT_COLLECTION,
  qdrantKey: process.env.QDRANT_KEY,
  qdrantMaxResults: parseInt(process.env.DEEPINFRA_MAX_RESULTS!),
  qdrantUrl: process.env.QDRANT_URL,
  rewriterModel: process.env.DEEPINFRA_REWRITER_MODEL,
  workflowName: process.env.WORKFLOW_NAME,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InputStateAnnotation = Annotation.Root({
  query: Annotation<string>,
  question: Annotation<string>,
})

const StateAnnotation = Annotation.Root({
  query: Annotation<string>,
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
})

const embeddings = new DeepInfraEmbeddings({
  modelName: config.embedModel,
  apiToken: config.apiKey,
})

const llm = new ChatOpenAI({
  model: config.llmModel,
  apiKey: config.apiKey,
  temperature: config.llmTemperature,
  maxTokens: config.llmMaxTokens,
  configuration: {
    baseURL: config.baseUrl,
  },
  streaming: true,
  cache: true,
})

const rewriter = new ChatOpenAI({
  model: config.rewriterModel,
  apiKey: config.apiKey,
  configuration: {
    baseURL: config.baseUrl,
  },
  cache: true,
})

const langfuseHandler = new CallbackHandler({
  publicKey: config.lfPublicKey,
  secretKey: config.lfSecretKey,
  baseUrl: config.lfBaseUrl,
})

const createVectorStore = async (
  embeddings: DeepInfraEmbeddings,
) => {
  return await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      apiKey: config.qdrantKey,
      url: config.qdrantUrl,
      collectionName: config.qdrantCollection,
    },
  )
}

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    const { messages, thread } = await readBody<{
      messages: Message[]
      thread: string
    }>(event)

    const question = messages[messages.length - 1].content
    const vectorStore = await createVectorStore(embeddings)

    const template = await pull('tcl-chatbot')

    const promptTemplate = ChatPromptTemplate.fromMessages(
      // @ts-expect-error type issue
      template.promptMessages,
    )

    const rewriteQuery = async (state: typeof InputStateAnnotation.State) => {
      const result = await rewriter.invoke([
        new SystemMessage(`
          You are an AI assistant tasked with reformulating user queries to improve retrieval in a RAG system. 
          Given the original query, rewrite it to be more specific, detailed, and likely to retrieve relevant information.
          Add a subtle Trotskyist perspective to the query.
          Only return the rewritten query, nothing else.

          Original query: {content}
        `),
        new HumanMessage({ content: state.question }),
      ])

      return { query: result.content }
    }

    const retrieve = async ({ query }: typeof InputStateAnnotation.State) => {
      const context: DocumentInterface[] = await vectorStore.similaritySearch(
        query,
        config.qdrantMaxResults,
      )

      return { context }
    }

    const generate = async (state: typeof StateAnnotation.State) => {
      const docsContent = state.context.map((doc) => doc.pageContent).join('\n')
      const messages = await promptTemplate.invoke({
        question: state.query,
        context: docsContent,
      })
      const response = await llm.invoke(messages)
      return { answer: response.content }
    }

    const workflow = new StateGraph(StateAnnotation)
      .addNode('rewrite', rewriteQuery)
      .addNode('retrieve', retrieve)
      .addNode('generate', generate)
      .addEdge('__start__', 'rewrite')
      .addEdge('rewrite', 'retrieve')
      .addEdge('retrieve', 'generate')
      .addEdge('generate', '__end__')

    const memory = new MemorySaver()
    const graph = workflow.compile({
      checkpointer: memory,
      name: config.workflowName,
    })

    const stream = await graph.stream(
      { question },
      {
        streamMode: 'messages',
        callbacks: [langfuseHandler],
        configurable: { thread_id: thread },
      },
    )

    const transformStream = new ReadableStream({
      async start(controller) {
        for await (const [message, _metadata] of stream) {
          if (_metadata.langgraph_node === 'generate') {
            controller.enqueue(message.content)
          }
        }
        controller.close()
      },
    })

    return LangChainAdapter.toDataStreamResponse(transformStream)
  })
})
