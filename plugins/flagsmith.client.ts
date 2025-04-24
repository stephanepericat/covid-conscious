import consola from 'consola'
import flagsmith from 'flagsmith'

export default defineNuxtPlugin(async () => {
  if (process.env.NODE_ENV === 'development') {
    consola.info('Retrieving flags...')
  }

  const config = useRuntimeConfig()

  if (config.public.flagsmith.environmentId) {
    await flagsmith.init({
      environmentID: config.public.flagsmith.environmentId,
      // onChange: (oldFlags, params) => {},
    })
  }
})
