import { defineVitestConfig } from '@nuxt/test-utils/config'
import { resolve } from 'node:path'

export default defineVitestConfig({
  test: {
    alias: {
      '@prisma/client': resolve('./tests/mocks/prisma.js'),
    },
    dir: 'tests',
    coverage: {
      enabled: true,
      include: [
        'composables/*.ts',
        'pages/**/*.vue',
      ],
      reportsDirectory: './coverage',
    },
    globals: true,
  },
})
