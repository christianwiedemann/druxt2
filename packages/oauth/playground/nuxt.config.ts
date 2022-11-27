import DruxtOauthModule from "..";

export default defineNuxtConfig({
    druxt: {
        baseUrl: 'http://druxt-drupal.docksal/',
        query: {
            'node--landing_page': {
                includes: ['layout_builder__blocks']
            }
        },
        proxy: {
            oauth: true
        }
    },
    auth:{
        strategies: {
            drupal: {
                scheme: 'oauth2',
                clientId: 'default_consumer',
                clientSecret: 'test',
                endpoints: {
                    authorization: 'http://druxt-drupal.docksal/druxt-oauth/authorize',
                    token: '/druxt-oauth/token'
                },
                scope: ['profile'],
                responseType: 'code',
                grantType: 'authorization_code',
                codeChallengeMethod: 'S256'
            }
        },
    },
    modules: [
        '@nuxtjs-alt/auth',
        "@nuxtjs-alt/http",
        '@pinia/nuxt',
        '@druxt2/druxt',
        '@druxt2/router',
        '@druxt2/entity',
        DruxtOauthModule
    ]
})
