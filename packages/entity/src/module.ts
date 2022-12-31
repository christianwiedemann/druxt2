import {addImports, createResolver, defineNuxtModule, installModule } from '@nuxt/kit'
import {fileURLToPath} from "url";


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
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.build.transpile.push(runtimeDir)

    await installModule('@druxt2/druxt')
    await installModule('@druxt2/router')
    await installModule('@druxt2/schema')

    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({ path: resolve('./runtime/components'), global: true });
    });

    // Register composables
    addImports([
      { name: 'druxtEntityWrapperTheme', as: 'druxtEntityWrapperTheme', from: resolve('./runtime/composables/druxtEntityWrapperTheme') },
      { name: 'useEntity', as: 'useEntity', from: resolve('./runtime/composables/useEntity') },
      { name: 'useEntityRender', as: 'useEntityRender', from: resolve('./runtime/composables/useEntity') },
      { name: 'useEntityLayoutBuilderRender', as: 'useEntityLayoutBuilderRender', from: resolve('./runtime/composables/useEntity') },
      { name: 'useEntityComponentOptions', as: 'useEntityComponentOptions', from: resolve('./runtime/composables/useEntity') },
      { name: 'useEntitySchema', as: 'useEntitySchema', from: resolve('./runtime/composables/useEntity') },
      { name: 'useEntityIsLayoutBuilderEnabled', as: 'useEntityIsLayoutBuilderEnabled', from: resolve('./runtime/composables/useEntity') },
      { name: 'useEntityLayoutBuilderSections', as: 'useEntityLayoutBuilderSections', from: resolve('./runtime/composables/useEntity') },
      { name: 'useEntityWrapperProps', as: 'useEntityWrapperProps', from: resolve('./runtime/composables/useEntity') },
    ])
  },
});


export default DruxtEntityNuxtModule
