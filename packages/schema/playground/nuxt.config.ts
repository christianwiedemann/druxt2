import {defineNuxtConfig} from 'nuxt'
import SchemaNuxtModule from '..'

export default defineNuxtConfig({
  'druxt': {
    baseUrl: 'http://druxt-drupal.docksal',
  },
  modules: [
    SchemaNuxtModule
  ],
  buildModules: ['@pinia/nuxt', '@druxt2/druxt', '@druxt2/schema']
})
