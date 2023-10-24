// @vitest-environment node
import { describe, it, expect } from 'vitest'

describe('demo', () => {
  it('should work', () => {
    expect(typeof window).toBe('undefined')
  })
})
