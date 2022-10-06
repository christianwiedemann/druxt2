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
                clientId: 'c79d2f5a-a153-4d3e-bb3d-1350f6f92d72',
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
