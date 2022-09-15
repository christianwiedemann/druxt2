import DruxtMenuNuxtModule from '..'

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
  modules: ['@pinia/nuxt', '@druxt2/druxt', DruxtMenuNuxtModule]
})
