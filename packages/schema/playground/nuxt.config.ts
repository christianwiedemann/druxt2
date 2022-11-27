import SchemaNuxtModule from '..'

export default defineNuxtConfig({
  druxt: {
    baseUrl: 'http://druxt-drupal.docksal',
  },
  modules: [
    SchemaNuxtModule
  ],
})
