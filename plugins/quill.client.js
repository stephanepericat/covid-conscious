import { QuillEditor } from '@vueup/vue-quill'
import consola from 'consola'

export default defineNuxtPlugin(({ vueApp }) => {
  if(process.env.NODE_ENV === 'development') {
    consola.info('Setting up vue quill...')
  }
  vueApp.component('QuillEditor', QuillEditor)
})
