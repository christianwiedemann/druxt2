import {defineNuxtConfig} from 'nuxt'

export default defineNuxtConfig({
    druxt: {
        baseUrl: 'http://druxt-drupal.docksal/',
        query: {
            'node--landing_page': {
                includes: ['layout_builder__blocks']
            }
        }
    },
    auth: {
        enableMiddleware: true,
        strategies: {
            drupal: {
                scheme: 'oauth2',
                clientId: '694458c4-8b59-4e68-ab01-d69b98443c24',
                clientSecret: 'test',
                endpoints: {
                    authorization: 'http://eep-develop.docksal/oauth/authorize',
                    token: 'http://eep-develop.docksal/eep-oauth/token'
                },
                scope: ['profile'],
                responseType: 'code',
                grantType: 'authorization_code',
                codeChallengeMethod: 'S256'
            }
        }
    },
    buildModules: [
        '@nuxtjs-alt/auth',
        "@nuxtjs-alt/http",
        '@pinia/nuxt'
    ]
})
