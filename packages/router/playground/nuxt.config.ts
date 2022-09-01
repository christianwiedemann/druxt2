import {defineNuxtConfig} from 'nuxt'
import DruxtRouterNuxtModule from '..'

export default defineNuxtConfig({
  'druxt': {
    baseUrl: 'http://druxt-drupal.docksal',
  },
  modules: [
    '@pinia/nuxt',

  ],
  buildModules: ['@druxt2/druxt', '@druxt2/schema', DruxtRouterNuxtModule]
})
