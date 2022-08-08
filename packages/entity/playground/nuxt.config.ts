import {defineNuxtConfig} from 'nuxt'
import DruxtEntityNuxtModule from '..'
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
    DruxtEntityNuxtModule
  ],
  buildModules: ['@pinia/nuxt', 'druxt3', 'druxt3-schema', 'druxt3-router', 'druxt3-entity']
})
