import {defineNuxtConfig} from 'nuxt'
import DruxtViewsNuxtModule from '..'
import dynamicImport from "vite-plugin-dynamic-import";

export default defineNuxtConfig({
  'druxt': {
    baseUrl: 'http://druxt-drupal.docksal/',
    query: {
      'node--landingpage': {
        includes: ['layout_builder__blocks']
      },
      'node--recipe': {
        includes: ['layout_builder__blocks']
      }
    }
  },
  vite: {
    plugins: [
      dynamicImport(),
    ],
  },
  modules: [
    DruxtViewsNuxtModule
  ],
  buildModules: ['@pinia/nuxt', '@druxt2/druxt', '@druxt2/schema', '@druxt2/entity']
})
