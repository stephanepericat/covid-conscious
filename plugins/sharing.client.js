import VueSocialSharing from 'vue-social-sharing'
import consola from 'consola'

export default defineNuxtPlugin(({ vueApp }) => {
  consola.info('Setting up social media sharing...')
  vueApp.use(VueSocialSharing)
})
