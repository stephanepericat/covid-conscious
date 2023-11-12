import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
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
