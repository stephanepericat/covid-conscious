import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    dir: 'tests',
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reportsDirectory: 'coverage',
    },
    globals: true,
  },
})
