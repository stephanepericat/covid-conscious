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
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap'},
      ],
    }
  },
  
  modules: [
    '@inkline/plugin/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/sanity',
    '@nuxtjs/turnstile',
    'nuxt-cloudflare-analytics',
    'nuxt-icon',
    '@nuxtjs/supabase',
    '@nuxtjs/robots',
    'nuxt-security',
    'nuxt-vitest',
    '@nuxtjs/sitemap',
    '@nuxt/image',
  ],

  runtimeConfig: {
    public: {
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

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'blob:', 'cdn.sanity.io'],
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
    }
  },

  supabase: {
    redirect: false,
    // redirectOptions: {
    //   callback: '/callback',
    //   exclude: [
    //     '/',
    //     '/fr',
    //     '/es',
    //     '/pt',
    //     '*/about',
    //     '*/forum',
    //     '*/forum/post/*',
    //     '*/forum/user/*',
    //     '*/forum-guidelines',
    //     '*/news',
    //     '*/community*',
    //     '*/education*',
    //     '*/scientific-library*',
    //     '*/product*',
    //     '*/resource*',
    //     '*/contribute',
    //     '*/search*',
    //     '*/author/*',
    //     '*/disclaimer',
    //     '*/privacy-policy',
    //     '*/terms-conditions',
    //     '*/login',
    //   ],
    //   login: '/login',
    // },
  },

  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
  },
});
