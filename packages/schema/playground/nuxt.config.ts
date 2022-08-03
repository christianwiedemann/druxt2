import {defineNuxtConfig} from 'nuxt'
import dynamicImport from 'vite-plugin-dynamic-import';
import SchemaNuxtModule from '..'

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
    SchemaNuxtModule
  ],
  vite: {
    plugins: [
      dynamicImport(),
    ],
  },
  buildModules: ['@pinia/nuxt', 'druxt3', 'druxt3-schema']
})
