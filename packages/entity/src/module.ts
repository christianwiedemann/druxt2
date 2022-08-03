import { join } from 'path'
import {createResolver, defineNuxtModule} from '@nuxt/kit'


export interface ModuleOptions {
  baseUrl: String
  router: Object
  proxy: any
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
const DruxtEntityNuxtModule =  defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'druxt-entity',
    configKey: 'druxt',
  },
  async setup(moduleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    // Set default options.
    const options = {
      baseUrl: moduleOptions.baseUrl,
    }

    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({ path: resolve('./runtime/components'),global: true });
    });


  },
});


export default DruxtEntityNuxtModule
