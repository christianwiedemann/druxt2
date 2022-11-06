import { existsSync } from 'fs'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { DruxtClient } from '@druxt2/core'
import {
  defineNuxtModule,
  addPlugin,
  extendPages,
  createResolver,
  addImports,
  resolveModule,
  installModule
} from '@nuxt/kit'
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
const DruxtRouterNuxtModule =  defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'druxt-router',
    configKey: 'druxt',
  },
  async setup(moduleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    const resolveRuntimeModule = (path: string) => resolveModule(path, { paths: runtimeDir })
    nuxt.options.build.transpile.push(runtimeDir)

    installModule('@druxt2/schema')
    // Set default options.
    const options = {
      baseUrl: moduleOptions.baseUrl,
      router: {
        pages: (await existsSync(resolve(nuxt.options.srcDir, nuxt.options.dir.pages))),

        wildcard: true,
        ...moduleOptions.router,
      }
    }

    addPlugin(resolveRuntimeModule('./plugins/redirect'));
    addPlugin(resolveRuntimeModule('./plugins/druxtRouter'));

    addImports([
      { name: 'useDruxtRouter', as: 'useDruxtRouter', from: resolveRuntimeModule('./composables/useDruxtRouter') },
      { name: 'useDruxtRouterProps', as: 'useDruxtRouterProps', from: resolveRuntimeModule('./composables/useDruxtRouter') },
    ])

    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({ path: resolve('./runtime/components'),global: true });
    });
    // Add Druxt router custom wildcard route.
    if (options.router.wildcard) {

      // Fetch languages.
      let languages = []
      const axios = require('axios').default;
      const druxt = new DruxtClient(options.baseUrl, {
        axios,
        ...options,
        // Disable API Proxy, as Proxies aren't available at build.
        proxy: {...moduleOptions.proxy || {}, api: false},
      })

      const languageResourceType = 'configurable_language--configurable_language'
      if (((await druxt.getIndex(languageResourceType)) || {}).href) {
        const query = new DrupalJsonApiParams().addFields(languageResourceType, ['drupal_internal__id'])
        languages = (await druxt.getCollectionAll(languageResourceType, query) || [])
          .map((o) => o.data)
          .flat()
          .filter((o) => !['und', 'zxx'].includes(((o || {}).attributes || {}).drupal_internal__id))
      }
      // Extend routes.
      extendPages((routes) => {
        // Add route per language.
        languages.filter((o) => o).forEach((o) => {
          routes.push({
            name: `druxt-router__${o.attributes.drupal_internal__id}`,
            //path: `/${o.attributes.drupal_internal__id}*`,
            path: '/${o.attributes.drupal_internal__id}:pathMatch(.*)*',
            file: resolve('./runtime/components/DruxtRouter.vue'),
            meta: {langcode: o.attributes.drupal_internal__id, auth: { guest: true } }
          })
        })

        // Add wildcard route.
        routes.push({
          name: 'druxt-router',
         // path: '*',
          path: '/:pathMatch(.*)*',
          file: resolve('./runtime/components/DruxtRouter.vue'),
          meta: {auth: { guest: true } }
        })
      })
    }
  },
});


export default DruxtRouterNuxtModule
