import {
    addPlugin,
    createResolver,
    defineNuxtModule,
    resolveModule
} from '@nuxt/kit'


export interface ModuleOptions {
    clientId: String,
    clientSecret: String
}

/**
 * The Nuxt.js module function.
 *
 * - Extends the Vue router, adding the Druxt wildcard route.
 * - Adds the Druxt router plugin.
 * - Adds the Druxt router Vuex store.
 *
 * The module function should not be used directly, but rather installed via your Nuxt configuration file.
 *
 * Options are set on the root level `druxt` Nuxt config object.
 *
 * @example @lang js
 * // `nuxt.config.js`
 * module.exports = {
 *   buildModules: ['druxt-router/nuxt'],
 *   druxt: {
 *     baseUrl: 'https://demi-api.druxtjs.org'
 *   }
 * }
 *
 * @property {object} options.druxt - Druxt root level options.
 * @property {string} options.druxt.baseUrl - Base URL of Drupal JSON:API backend.
 * @property {string} options.druxt.router.component - File to custom Router component.
 */
const DruxtOauthModule = defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'druxt-oauth',
        configKey: 'druxtOauth',
    },
    defaults: {
        clientId: '',
        clientSecret: ''
    },
    async setup(moduleOptions, nuxt) {

        const {resolve} = createResolver(import.meta.url);
        const resolveRuntimeModule = (path: string) => resolveModule(path, {paths: resolve('./runtime')})


        addPlugin(resolveRuntimeModule('./plugins/authorize'));

        nuxt.hook("components:dirs", (dirs) => {
            dirs.push({path: resolve('./runtime/components'), global: true});
        });
    },
});


export default DruxtOauthModule
