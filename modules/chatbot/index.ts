import { createResolver, defineNuxtModule, addServerHandler } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'chatbot',
  },
  setup() {
    const resolver = createResolver(import.meta.url)

    // Add an API route
    addServerHandler({
      route: '/api/chat',
      method: 'post',
      handler: resolver.resolve('./runtime/routes/chat.ts'),
    })
  },
})
