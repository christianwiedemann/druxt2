import DruxtOauthModule from "..";
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
        strategies: {
            drupal: {
                scheme: 'oauth2',
                clientId: 'eb9a638f-5a63-4184-b2e2-cb4e243b3d49',
                clientSecret: 'test',
                endpoints: {
                    authorization: 'http://druxt-drupal.docksal/oauth/authorize',
                    token: 'http://druxt-drupal.docksal/druxt-oauth/token'
                },
                scope: ['profile'],
                responseType: 'code',
                grantType: 'authorization_code',
                codeChallengeMethod: 'S256'
            }
        }
    },
    modules: [
        DruxtOauthModule
    ],
    buildModules: [
        '@nuxtjs-alt/auth',
        "@nuxtjs-alt/http",
        '@pinia/nuxt',
        '@druxt2/druxt'
    ]
})
