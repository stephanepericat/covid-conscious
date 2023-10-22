import VueSocialSharing from 'vue-social-sharing'
import consola from 'consola'

export default defineNuxtPlugin(({ vueApp }) => {
  if(process.env.NODE_ENV === 'development') {
    consola.info('Setting up social media sharing...')
  }
  vueApp.use(VueSocialSharing)
})
