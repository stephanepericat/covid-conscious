import type { Message } from 'ai'

export type Payload = {
  collection: string
  messages: Message[]
  threadId: string
  userId: string
}
