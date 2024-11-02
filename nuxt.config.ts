// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // devtools: { enabled: process.env.NODE_ENV === 'development' },
  extends: ['nuxt-umami'],

  devtools: { enabled: false },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/tcl-logo-big-transparent.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: "anonymous" },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Oswald:wght@200..700&display=swap' },
        { rel: 'stylesheet', href: 'https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.css'},
      ],
      script: [
        { src: 'https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.js', type: 'text/javascript' },
      ]
    }
  },
  
  // @ts-ignore
  modules: [
    '@vueuse/nuxt',
    '@inkline/plugin/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/sanity',
    '@nuxtjs/turnstile',
    'nuxt-cloudflare-analytics',
    'nuxt-icon',
    '@nuxtjs/supabase',
    'nuxt-security',
    'nuxt-vitest',
    '@nuxt/image',
    'nuxt3-leaflet',
    '@nuxtjs/seo',
    'nuxt-auth-utils',
    '@prisma/nuxt',
  ],

  runtimeConfig: {
    public: {
      bypassLogin: process.env.APP_BYPASS_LOGIN === '1' || false,
      supabaseForum: {
        rootPath: '/forum',
      },
    },
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    },
  },

  // module options

  cloudflareAnalytics: {
    proxyPath: '/api/_ca/p',
    token: process.env.CLOUDFLARE_ANALYTICS_TOKEN,
  },

  inkline: {
    globals: {
      colorMode: 'light',
      colorModeStrategy: 'localStorage',
    },
  },

  i18n: {
    baseUrl: `${process.env.NUXT_PUBLIC_SITE_URL}/`,
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', flag: 'flag:us-1x1', file: 'en.js' },
      { code: 'es', iso: 'es-MX', name: 'Español', flag: 'flag:mx-1x1', file: 'es.js' },
      { code: 'fr', iso: 'fr-FR', name: 'Français', flag: 'flag:fr-1x1', file: 'fr.js' },
      { code: 'pt', iso: 'pt-BR', name: 'Português', flag: 'flag:br-1x1', file: 'pt.js' },
    ],
  },

  linkChecker: {
    enabled: false
  },

  ogImage: {
    enabled: false,
  },

  robots: {
    disallow: [
      '/account',
      '/forum/create',
      '/forum/my-posts',
    ],
  },

  sanity: {
    apiVersion: '2021-10-21',
    dataset: process.env.SANITY_DATASET,
    projectId: process.env.SANITY_PROJECTID,
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
        'img-src': ["'self'", 'data:', 'blob:', 'cdn.sanity.io', 'a.tile.openstreetmap.org', 'b.tile.openstreetmap.org', 'c.tile.openstreetmap.org', 'gravatar.com', '*.ytimg.com'],
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
    }
  },

  seoExperiments: {
    enabled: false
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
    name: 'That Covid Life',
    description: 'That Covid Life serves as an educational tool that gathers links to news, research, and other resources relative to COVID-19.',
  },

  sitemap: {
    sitemaps: {
      'en-US': {
        sources: [
          '/api/__sitemap__/urls',
        ],
      },
      'es-MX': {
        sources: [
          '/api/__sitemap__/urls?locale=es',
        ],
      },
      'fr-FR': {
        sources: [
          '/api/__sitemap__/urls?locale=fr',
        ],
      },
      'pt-BR': {
        sources: [
          '/api/__sitemap__/urls?locale=pt',
        ],
      },
    },
  },

  supabase: {
    redirect: false,
  },

  tailwindcss: {
    viewer: false,
  },

  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
  },
});