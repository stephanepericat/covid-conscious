import { QuillEditor } from '@vueup/vue-quill'
import consola from 'consola'

export default defineNuxtPlugin(({ vueApp }) => {
  consola.info('Setting up vue quill...')
  vueApp.component('QuillEditor', QuillEditor)
})
