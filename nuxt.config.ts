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
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Oswald:wght@200..700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap',
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
  devtools: { enabled: false },

  i18n: {
    baseUrl: `${process.env.NUXT_PUBLIC_SITE_URL}/`,
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.ts',
      },
      {
        code: 'es',
        iso: 'es-MX',
        name: 'Español',
        file: 'es.ts',
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
        file: 'fr.ts',
      },
      {
        code: 'pt',
        iso: 'pt-BR',
        name: 'Português',
        file: 'pt.ts',
      },
    ],
  },

  linkChecker: {
    enabled: false,
  },

  modules: [
    '@formkit/auto-animate/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/sanity',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/turnstile',
    '@pinia/nuxt',
    '@prisma/nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
    'nuxt-security',
    'shadcn-nuxt',
  ],

  ogImage: {
    enabled: false,
  },

  pinia: {
    storesDirs: ['./store/**'],
  },

  // posthog: {
  //   publicKey: process.env.POSTHOG_PUBLIC_KEY,
  //   host: process.env.POSTHOG_HOST,
  //   disabled: process.env.NODE_ENV === 'development',
  // },

  prisma: {
    installCLI: process.env.NODE_ENV === 'development',
    installClient: process.env.NODE_ENV === 'development',
    installStudio: false,
  },

  robots: {
    disallow: [
      '/user/account',
      '/user/bookmarks',
      '/forum/create',
      '/forum/my-posts',
    ],
  },

  runtimeConfig: {
    public: {
      flagsmith: {
        environmentId: process.env.FLAGSMITH_ENVIRONMENT_ID,
      },
      statsig: {
        clientKey: process.env.STATSIG_CLIENT_ID,
      },
    },
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    },
  },

  sanity: {
    apiVersion: '2025-03-19',
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
          'prodregistryv2.org',
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

  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser':
          './node_modules/.prisma/client/index-browser.js',
      },
    },
  },
})
