// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/tcl-logo-big-transparent.ico',
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Oswald:wght@200..700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.css',
        },
      ],
      script: [
        {
          src: 'https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.js',
          type: 'text/javascript',
        },
      ],
    },
  },

  colorMode: {
    classSuffix: '',
  },

  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  i18n: {
    baseUrl: `${process.env.NUXT_PUBLIC_SITE_URL}/`,
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.js',
      },
      {
        code: 'es',
        iso: 'es-MX',
        name: 'Español',
        file: 'es.js',
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
        file: 'fr.js',
      },
      {
        code: 'pt',
        iso: 'pt-BR',
        name: 'Português',
        file: 'pt.js',
      },
    ],
  },

  linkChecker: {
    enabled: false,
  },

  modules: [
    '@nuxt/icon',
    '@nuxt/test-utils/module',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/sanity',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/turnstile',
    '@pinia/nuxt',
    '@prisma/nuxt',
    'nuxt-auth-utils',
    'nuxt-security',
    'nuxt-umami',
    'shadcn-nuxt',
  ],

  ogImage: {
    enabled: false,
  },

  pinia: {
    storesDirs: ['./store/**'],
  },

  prisma: {
    installCLI: process.env.NODE_ENV === 'development',
    installClient: process.env.NODE_ENV === 'development',
    installStudio: false,
  },

  robots: {
    disallow: ['/account', '/forum/create', '/forum/my-posts'],
  },

  runtimeConfig: {
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    },
  },

  sanity: {
    apiVersion: '2024-07-11',
    dataset: process.env.SANITY_DATASET,
    minimal: true,
    projectId: process.env.SANITY_PROJECTID,
    token: process.env.SANITY_TOKEN,
    useCdn: true,
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'That Covid Life',
      url: 'https://thatcovid.life',
      logo: 'https://thatcovid.life/tcl-icon.png',
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'cdn.sanity.io',
          'a.tile.openstreetmap.org',
          'b.tile.openstreetmap.org',
          'c.tile.openstreetmap.org',
          'gravatar.com',
          '*.ytimg.com',
        ],
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
    name: 'That Covid Life',
    description:
      'That Covid Life serves as an educational tool that gathers links to news, research, and other resources relative to COVID-19.',
  },

  sitemap: {
    sitemaps: {
      'en-US': {
        sources: ['/api/__sitemap__/urls'],
      },
      'es-MX': {
        sources: ['/api/__sitemap__/urls?locale=es'],
      },
      'fr-FR': {
        sources: ['/api/__sitemap__/urls?locale=fr'],
      },
      'pt-BR': {
        sources: ['/api/__sitemap__/urls?locale=pt'],
      },
    },
  },

  tailwindcss: {
    viewer: false,
  },

  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
  },

  umami: {
    id: process.env.NUXT_PUBLIC_UMAMI_ID,
    host: process.env.NUXT_PUBLIC_UMAMI_HOST,
    autoTrack: true,
    ignoreLocalhost: true,
    domains: ['covid-conscious-preview.vercel.app', 'thatcovid.life'],
    logErrors: true,
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
