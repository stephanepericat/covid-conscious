import { ChatOpenAI } from '@langchain/openai'
import { DeepInfraEmbeddings } from '@langchain/community/embeddings/deepinfra'
import { Annotation } from '@langchain/langgraph'
import type { Document } from '@langchain/core/documents'
import { QdrantVectorStore } from '@langchain/qdrant'
import { CallbackHandler } from 'langfuse-langchain'
import { type Duration, Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { config } from './config'

const ratelimit = new Ratelimit({
  redis: new Redis({
    url: config.upstashUrl,
    token: config.upstashToken,
  }),
  limiter: Ratelimit.slidingWindow(
    config.rateMaxRequests,
    config.rateWindow as Duration,
  ),
  analytics: true,
  prefix: config.ratePrefix,
})

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
  collectionName?: string,
) => {
  return await QdrantVectorStore.fromExistingCollection(embeddings, {
    apiKey: config.qdrantKey,
    url: config.qdrantUrl,
    collectionName: collectionName || config.qdrantCollection,
  })
}

export {
  createVectorStore,
  embeddings,
  InputStateAnnotation,
  llm,
  langfuseHandler,
  ratelimit,
  rewriter,
  StateAnnotation,
}
