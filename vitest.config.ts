import { defineVitestConfig } from 'nuxt-vitest/config'
import { resolve } from 'node:path'

export default defineVitestConfig({
  test: {
    alias: {
      '@prisma/client': resolve('./tests/mocks/prisma.js')
    },
    dir: 'tests',
    coverage: {
      enabled: true,
      exclude: [
        "**/*.mjs",
        "assets/constants/*.js",
        "locales/*.js",
        "plugins/*.js",
      ],
      provider: 'istanbul',
      reportsDirectory: './coverage',
    },
    globals: true,
  },
})
