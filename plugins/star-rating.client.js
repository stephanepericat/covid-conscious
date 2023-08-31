import StarRating from 'vue-star-rating'
import consola from 'consola'

export default defineNuxtPlugin(({ vueApp }) => {
  consola.info('Setting up star rating...')
  vueApp.component('StarRating', StarRating)
})
