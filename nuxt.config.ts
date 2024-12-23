// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/sanity',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@prisma/nuxt',
    'nuxt-auth-utils',
    'shadcn-nuxt',
  ],

  pinia: {
    storesDirs: ['./store/**'],
  },

  prisma: {
    installCLI: process.env.NODE_ENV === 'development',
    installClient: process.env.NODE_ENV === 'development',
    installStudio: false,
  },

  sanity: {
    apiVersion: '2024-07-11',
    dataset: process.env.SANITY_DATASET,
    minimal: true,
    projectId: process.env.SANITY_PROJECTID,
    token: process.env.SANITY_TOKEN,
    useCdn: true,
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  tailwindcss: {
    viewer: false,
  },

  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser':
          './node_modules/.prisma/client/index-browser.js',
      },
    },
  },
})
