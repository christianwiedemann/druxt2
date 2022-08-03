import {defineNuxtConfig} from 'nuxt'
import DruxtNuxtModule from '..'

export default defineNuxtConfig({
  'druxt': {
    baseUrl: 'http://eep-develop.docksal.site',
  },
  components: {
    global: true,
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
    DruxtNuxtModule
  ],
  buildModules: ['@pinia/nuxt', 'druxt3']
})
