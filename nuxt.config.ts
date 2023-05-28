// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@inkline/plugin/nuxt', '@nuxtjs/i18n', 'nuxt-icon'],
  inkline: {
    globals: {
      colorMode: 'light',
    },
  },
  i18n: {
    baseUrl: '/',
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', name: 'English (US)', flag: 'flag:us-1x1' },
      { code: 'es', iso: 'es-MX', name: 'Español (MX)', flag: 'flag:mx-1x1' },
      { code: 'fr', iso: 'fr-FR', name: 'Français (FR)', flag: 'flag:fr-1x1' },
      { code: 'pt', iso: 'pt-BR', name: 'Português (BR)', flag: 'flag:br-1x1' },
    ],
    vueI18n: './i18n.config.ts',
  }
});
