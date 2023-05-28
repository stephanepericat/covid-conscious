// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@inkline/plugin/nuxt', '@nuxtjs/i18n'],
  inkline: {
    globals: {
      colorMode: 'light',
    },
  },
  i18n: {
    baseUrl: '/',
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'pt'],
    vueI18n: './i18n.config.ts',
  }
});
