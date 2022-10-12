import {addImports, createResolver, defineNuxtModule, installModule, resolveModule} from '@nuxt/kit'
import {
  useEntityIsLayoutBuilderEnabled, useEntityLayoutBuilderRender,
  useEntityLayoutBuilderSections,
  useEntitySchema
} from "./runtime/composables/useEntity";
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
    const resolveRuntimeModule = (path: string) => resolveModule(path, { paths: runtimeDir })

    nuxt.options.build.transpile.push(runtimeDir)

    installModule('@druxt2/router')
    installModule('@druxt2/schema')

    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({ path: resolve('./runtime/components'), global: true });
    });

    // Register composables
    addImports([
      { name: 'useEntityLayoutBuilderRender', as: 'useEntityLayoutBuilderRender', from: resolveRuntimeModule('./composables/useEntity') },
      { name: 'useEntityComponentOptions', as: 'useEntityComponentOptions', from: resolveRuntimeModule('./composables/useEntity') },
      { name: 'useEntitySchema', as: 'useEntitySchema', from: resolveRuntimeModule('./composables/useEntity') },
      { name: 'useEntityIsLayoutBuilderEnabled', as: 'useEntityIsLayoutBuilderEnabled', from: resolveRuntimeModule('./composables/useEntity') },
      { name: 'useEntityLayoutBuilderSections', as: 'useEntityLayoutBuilderSections', from: resolveRuntimeModule('./composables/useEntity') },

    ])
  },
});


export default DruxtEntityNuxtModule
