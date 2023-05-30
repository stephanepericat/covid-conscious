// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: "anonymous" },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed&display=swap' },
      ]
    }
  },
  
  modules: ['@inkline/plugin/nuxt', '@nuxtjs/i18n', '@nuxtjs/sanity', 'nuxt-icon'],

  inkline: {
    globals: {
      colorMode: 'dark',
      colorModeStrategy: 'localStorage',
    },
  },

  i18n: {
    baseUrl: '/',
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      { code: 'en', iso: 'en-US', name: 'English (US)', flag: 'flag:us-1x1', file: 'en.js' },
      { code: 'es', iso: 'es-MX', name: 'Español (MX)', flag: 'flag:mx-1x1', file: 'es.js' },
      { code: 'fr', iso: 'fr-FR', name: 'Français (FR)', flag: 'flag:fr-1x1', file: 'fr.js' },
      { code: 'pt', iso: 'pt-BR', name: 'Português (BR)', flag: 'flag:br-1x1', file: 'pt.js' },
    ],
  },

  sanity: {
    apiVersion: '2021-10-21',
    dataset: process.env.SANITY_DATASET,
    projectId: process.env.SANITY_PROJECTID,
  },
});
