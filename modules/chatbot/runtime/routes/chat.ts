import { LangChainAdapter, createDataStreamResponse } from 'ai'
import { MemorySaver, StateGraph } from '@langchain/langgraph'
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres'

import { config } from '../lib/config'
import {
  createVectorStore,
  embeddings,
  InputStateAnnotation,
  langfuseHandler,
  llm,
  ratelimit,
  rewriter,
  StateAnnotation,
} from '../lib/initializers'
import {
  createRewriterPrompt,
  createLlmInstructions,
  createLlmPrompt,
} from '../lib/messages'

import type { DocumentInterface } from '@langchain/core/documents'
import type { DataStreamString } from '@ai-sdk/ui-utils'
import type { Payload } from '../lib/types'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    // make sure user is authenticated
    await requireUserSession(event)

    const { collection, messages, threadId, userId }: Payload =
      await readBody(event)

    const { success, remaining } = await ratelimit.limit(userId)

    if (!success) {
      setResponseStatus(event, 429, 'Too many requests')
      return `Too many requests, please try again later. Remaining: ${remaining}`
    }

    const configurable = { thread_id: threadId }
    const question = messages[messages.length - 1].content
    const vectorStore = await createVectorStore(embeddings, collection)

    const rewriteQuery = async (state: typeof InputStateAnnotation.State) => {
      const result = await rewriter.invoke([
        createRewriterPrompt(state.question),
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
      const messages = [
        createLlmInstructions(),
        createLlmPrompt(state.query, docsContent),
      ]
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

    let checkpointer

    if (config.memoryPostgresUrl) {
      checkpointer = PostgresSaver.fromConnString(config.memoryPostgresUrl)
      await checkpointer.setup()
    } else {
      checkpointer = new MemorySaver()
    }

    const graph = workflow.compile({
      checkpointer,
      name: config.workflowName,
    })

    const stream = await graph.stream(
      { question },
      {
        streamMode: 'messages',
        callbacks: [langfuseHandler],
        configurable,
      },
    )

    const langchainStream = new ReadableStream<DataStreamString>({
      async start(controller) {
        for await (const [message, _metadata] of stream) {
          if (_metadata.langgraph_node === 'generate') {
            controller.enqueue(message.content)
          }
        }
        await langfuseHandler.shutdownAsync()
        controller.close()
      },
    })

    return createDataStreamResponse({
      status: 200,
      statusText: 'OK',
      execute(dataStream) {
        LangChainAdapter.mergeIntoDataStream(langchainStream, {
          dataStream,
        })
      },
    })
  })
})
