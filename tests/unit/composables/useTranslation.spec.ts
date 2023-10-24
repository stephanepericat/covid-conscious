import { describe, it, expect } from 'vitest'
import { registerEndpoint } from 'nuxt-vitest/utils'
import { useTranslation } from '~/assets/composables/useTranslation'

describe.skip('Composables > useTranslation', () => {
  it('should make an api call to get a translation', async () => {
    registerEndpoint('/api/translate', () => ({
      data: {
        value: {
          foo: 'bar'
        }
      },
      error: null
    }))
    const { translateText } = useTranslation()
    const result = await translateText('Hello, world!', 'fr')
    expect(result).toEqual({ value: { foo: 'bar' } })
  })
})