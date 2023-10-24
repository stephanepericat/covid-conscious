// @vitest-environment nuxt

import { describe, it, expect } from 'vitest'
import { registerEndpoint } from 'nuxt-vitest/utils'
import { useTranslation } from '~/assets/composables/useTranslation'

describe('Composables > useTranslation', () => {
  it('should make an api call to get a translation', async () => {
    registerEndpoint('/api/translate', () => ({
      value: {
        foo: 'bar',
      },
    }))
    const { translateText } = useTranslation()
    const result = await translateText('Hello, world!', 'fr')
    expect(result).toEqual({ value: { foo: 'bar' } })
  })
})