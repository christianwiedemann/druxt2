import DruxtEntityNuxtModule from '..'

export default defineNuxtConfig({
  vite: {
    server: {
      hmr: {
        protocol: 'wss'
      }
    }
  },
  components: {
    global: true,
    dirs: [
      '~/components',
    ],
  },
  'druxt': {
    baseUrl: 'http://druxt-drupal.docksal/',
    query: {
      'node--landingpage': {
        include: ['layout_builder__blocks']
      },
      'node--recipe': {
        include: ['layout_builder__blocks']
      }
    }
  },
  modules: [
    DruxtEntityNuxtModule
  ],
  buildModules: ['@pinia/nuxt', '@druxt2/druxt', '@druxt2/schema', '@druxt2/router' ]
})
