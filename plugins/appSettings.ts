import consola from 'consola'
import APP_SETTINGS_QUERY from '~/sanity/queries/appSettings.sanity'
import type { APP_SETTINGS_QUERYResult } from '~/sanity/types'

export default defineNuxtPlugin(async () => {
  if(process.env.NODE_ENV === 'development') {
    consola.info('Retrieving app settings...')
  }

  const { data } = await useSanityQuery<APP_SETTINGS_QUERYResult>(APP_SETTINGS_QUERY)
  const appSettings = data.value?.reduce((acc, prop) => {
    // @ts-ignore
    acc[prop.key] = prop.value
    return acc
  }, {})

  return {
    provide: {
      appSettings,
    }
  }
})
