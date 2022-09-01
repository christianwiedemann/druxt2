import {defineNuxtConfig} from 'nuxt'
import SchemaNuxtModule from '..'
import dynamicImport from "vite-plugin-dynamic-import";

export default defineNuxtConfig({
  'druxt': {
    baseUrl: 'http://druxt-drupal.docksal',
  },
  vite: {
    plugins: [
      dynamicImport(),
    ],
  },
  modules: [
    SchemaNuxtModule
  ],
  buildModules: ['@pinia/nuxt', '@druxt2/druxt', '@druxt2/schema']
})
