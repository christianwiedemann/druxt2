import {defineNuxtConfig} from 'nuxt'
import SchemaNuxtModule from '..'

export default defineNuxtConfig({
  'druxt': {
    baseUrl: 'http://druxt-drupal.docksal',
  },
  modules: [
    SchemaNuxtModule
  ],
  buildModules: ['@druxt2/schema']
})
