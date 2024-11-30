// @vitest-environment nuxt

import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useTranslation } from '~/assets/composables/useTranslation'

const { useFetchMock } = vi.hoisted(() => {
  return {
    useFetchMock: vi.fn().mockImplementation(() => {
      return {
        data: { value: { foo: 'bar' } },
        error: { value: null },
      }
    }),
  }
})

mockNuxtImport('useFetch', () => useFetchMock)

describe('Composables > useTranslation', () => {
  it('should make an api call to get a translation', async () => {
    const { translateText } = useTranslation()
    const result = await translateText('Hello, world!', 'fr')
    expect(result).toEqual({ foo: 'bar' })
  })

  it('should return null, if there is no data', async () => {
    useFetchMock.mockImplementation(() => {
      return { data: null, error: { value: null } }
    })

    const { translateText } = useTranslation()
    const result = await translateText('Hello, world!', 'fr')
    expect(result).toBeNull()
  })

  it('should throw an error, if something goes wrong with the api call', async () => {
    useFetchMock.mockImplementation(() => {
      return { data: { value: null }, error: { value: 'Something went wrong' } }
    })

    const { translateText } = useTranslation()

    try {
      await translateText('Hello, world!', 'fr')
    } catch (e) {
      expect(e).toEqual('Something went wrong')
    }
  })
})
