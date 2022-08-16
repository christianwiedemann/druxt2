import {defineNuxtConfig} from 'nuxt'
import DruxtMenuNuxtModule from '..'
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
    DruxtMenuNuxtModule
  ],
  autoImports: {
    global: true,
  },
  buildModules: ['@pinia/nuxt', 'druxt3']
})
