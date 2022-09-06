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
                clientId: '1faa7a96-e416-4bb2-8678-a1ecee6e7472',
                clientSecret: 'test',
                endpoints: {
                    //configuration: 'http://oidconnect.docksal/.well-known/openid-configuration'
                    authorization: 'http://oidconnect.docksal/oauth/authorize',
                    token: 'http://oidconnect.docksal/druxt-oauth/token'
                },
                scope: ['openid'],
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
