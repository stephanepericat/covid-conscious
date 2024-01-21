import consola from 'consola'
import appSettingsQuery from '~/sanity/appSettings.sanity'

export default defineNuxtPlugin(async ({ vueApp }) => {
  if(process.env.NODE_ENV === 'development') {
    consola.info('Retrieving app settings...')
  }

  const { data } = await useSanityQuery(appSettingsQuery)
  const appSettings = data.value.reduce((acc, prop) => {
    acc[prop.key] = prop.value
    return acc
  }, {})

  return {
    provide: {
      appSettings,
    }
  }
})
