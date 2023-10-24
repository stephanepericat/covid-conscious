import { describe, it, expect } from 'vitest'

describe('demo', () => {
  it('should work', () => {
    expect(useAppConfig()).toMatchInlineSnapshot(`
      {
        "nuxt": {},
      }
    `);
  })
})
