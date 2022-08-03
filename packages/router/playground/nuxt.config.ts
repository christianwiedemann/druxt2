import {defineNuxtConfig} from 'nuxt'
import DruxtRouterNuxtModule from '..'

export default defineNuxtConfig({
  'druxt': {
    baseUrl: 'http://eep-develop.docksal.site',
  },
  runtimeConfig: {
    public: {
      baseUrl: 'http://eep-develop.docksal.site',
      query: {
        'node--landing_page': {
          includes: ['layout_builder__blocks']
        }
      }
    }
  },
  modules: [
    '@pinia/nuxt',

  ],
  buildModules: ['druxt3', 'druxt3-schema', DruxtRouterNuxtModule]
})
