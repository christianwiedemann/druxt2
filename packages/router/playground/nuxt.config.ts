import {defineNuxtConfig} from 'nuxt'
import DruxtRouterNuxtModule from '..'

export default defineNuxtConfig({
  'druxt': {
    baseUrl: 'http://druxt-drupal.docksal',
  },
  modules: [DruxtRouterNuxtModule]
})
