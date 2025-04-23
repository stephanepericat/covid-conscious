import posthog from 'posthog-js'
import consola from 'consola'

export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === 'development') {
    consola.info('Setting up Posthog...')
  }

  const runtimeConfig = useRuntimeConfig()
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost,
    capture_pageview: true, // we add manual pageview capturing below
    capture_pageleave: true, // automatically capture a pageleave event when the user leaves the site or closes the tab
    loaded: (posthog) => {
      if (import.meta.env.MODE === 'development') posthog.debug()
    },
  })

  // Make sure that pageviews are captured with each route change
  // const router = useRouter()
  // router.afterEach((to) => {
  //   nextTick(() => {
  //     posthog.capture('$pageview', {
  //       current_url: to.fullPath,
  //     })
  //   })
  // })

  return {
    provide: {
      posthog: () => posthogClient,
    },
  }
})
