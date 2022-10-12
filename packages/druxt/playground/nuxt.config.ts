import DruxtNuxtModule from '..'

export default defineNuxtConfig({
  'druxt': {
    baseUrl: 'http://druxt-drupal.docksal/',
    query: {
      'node--landing_page': {
        includes: ['layout_builder__blocks']
      }
    }
  },
  modules: [
    DruxtNuxtModule
  ],
})
