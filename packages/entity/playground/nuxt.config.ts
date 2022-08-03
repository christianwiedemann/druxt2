import {defineNuxtConfig} from 'nuxt'
import DruxtEntityNuxtModule from '..'

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
    DruxtEntityNuxtModule
  ],
  buildModules: ['@pinia/nuxt', 'druxt3', 'druxt3-schema', 'druxt3-router']
})
