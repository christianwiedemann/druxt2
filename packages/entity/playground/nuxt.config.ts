import DruxtEntityNuxtModule from '../src/module'

export default defineNuxtConfig({
  ssr: true,
  components: {
    global: true,
    dirs: [
      '~/components',
    ],
  },
  'druxt': {
    baseUrl: 'http://druxt-drupal.docksal/',
    proxy: {
      api: false,
      oauth: false,
      files: 'default'
    },
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
    DruxtEntityNuxtModule,
  ],
})
