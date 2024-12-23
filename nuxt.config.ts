// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
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