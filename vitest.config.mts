import { defineVitestConfig } from '@nuxt/test-utils/config'
import { resolve } from 'node:path'

export default defineVitestConfig({
  test: {
    alias: {
      '@prisma/client': resolve('./tests/mocks/prisma.js'),
    },
    dir: 'tests',
    coverage: {
      enabled: false, // TODO: fix!!
      exclude: [
        '**/*.mjs',
        'assets/constants/*.js',
        'i18n/locales/*.js',
        'plugins/*.js',
      ],
      provider: 'istanbul',
      reportsDirectory: './coverage',
    },
    globals: true,
  },
})
