import {DrupalJsonApiParams} from 'drupal-jsonapi-params'

import {defineNuxtModule, createResolver, installModule, addImports, resolveModule, addPlugin} from '@nuxt/kit'
import {DruxtClient} from '@druxt2/core'

interface ProxyInterface {
  api: Boolean
  oauth: Boolean
  files: String
}

export interface ModuleOptions {
  baseUrl: String
  proxy: ProxyInterface
  endpoint: String
}

/**
 * Nuxt module function to install Druxt.
 *
 * @param {ModuleOptions} moduleOptions - DruxtJS module options.
 *
 * @example <caption>Nuxt configuration with module options</caption> @lang js
 * module.exports = {
 *   modules: [
 *     ['druxt', { baseUrl: 'https://demo-api.druxtjs.org' }]
 *   ]
 * }
 *
 * @example <caption>Nuxt configuration with root level options</caption> @lang js
 * module.exports = {
 *   modules: [
 *     'druxt'
 *   ],
 *   druxt: {
 *     baseUrl: 'https://demo-api.druxtjs.org'
 *   }
 * }
 */

const DruxtNuxtModule = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'druxt',
    configKey: 'druxt'
  },
  defaults: {
    proxy: {
      api: true,
      oauth: true,
      files: 'default'
    },
    baseUrl: '',
    endpoint: '/jsonapi'
  },

  async setup(moduleOptions, nuxt) {

    const {resolve} = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')
    const resolveRuntimeModule = (path: string) => resolveModule(path, {paths: runtimeDir})
    const options: any = {
      ...(moduleOptions || {})
    }
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@druxt/core')

    // Register composables
    addImports([
      {name: 'DruxtStore', as: 'DruxtStore', from: resolveRuntimeModule('./stores/druxt')},
      {name: 'useDruxtClient', as: 'useDruxtClient', from: resolveRuntimeModule('./composables/useDruxtClient')},
      {name: 'druxtTheme', as: 'druxtTheme', from: resolveRuntimeModule('./composables/druxtTheme')},
      {name: 'druxtRender', as: 'druxtRender', from: resolveRuntimeModule('./composables/druxtRender')}
    ])
    addPlugin(resolveRuntimeModule('./plugins/druxtClient'))

    // Normalize slashes.
    const baseUrl = options.baseUrl = options.baseUrl.endsWith('/') ? options.baseUrl.slice(0, -1) : options.baseUrl
    options.endpoint = options.endpoint = options.endpoint.startsWith('/') ? options.endpoint : `/${options.endpoint}`
    options.query = options.query ?? null
    // Provide runtime configuration
    nuxt.options.runtimeConfig.public.baseUrl = baseUrl
    nuxt.options.runtimeConfig.public.endpoint = options.endpoint
    nuxt.options.runtimeConfig.public.options = options
    const axios = require('axios').default;
    const druxt = new DruxtClient(options.baseUrl, { axios })

    // Nuxt proxy integration.
    if (options.proxy) {
      const proxies:any = {}

      // Enable proxying of the API endpoint.
      // This is primarily used to avoid CORS errors.
      if ((options.proxy || {}).api) {
        // Main API Endpoint.
        proxies[options.endpoint] = options.baseUrl

        // Enable proxying of the oauth endpoint.
        // This is primarily used to avoid CORS errors.
        if ((options.proxy || {}).oauth) {
          proxies['/druxt-oauth/token'] = options.baseUrl
          proxies['/oauth/debug'] = options.baseUrl
        }

        // Langcode prefixed API endpoints.
        const languageResourceType = 'configurable_language--configurable_language'
        if (((await druxt.getIndex(languageResourceType)) || {}).href) {
          const query = new DrupalJsonApiParams().addFields(languageResourceType, ['drupal_internal__id'])
          const languages = (await druxt.getCollectionAll(languageResourceType, query) || [])
            .map(o => o.data)
            .flat()
            .filter(o => !['und', 'zxx'].includes(((o || {}).attributes || {}).drupal_internal__id))
            .map(o => o.attributes.drupal_internal__id)
          for (const langcode of languages) {
            proxies[`/${langcode}${options.endpoint}`] = options.baseUrl
            if ((options.proxy || {}).oauth) {
              proxies[`/${langcode}/druxt-oauth/token`] = options.baseUrl;
              proxies[`/${langcode}/oauth/debug`] = options.baseUrl;
            }
          }
        }

        // Decoupled Router Endpoint.
        proxies['/router/translate-path'] = options.baseUrl
      }

      // Enable proxying of the Drupal site files.
      if ((options.proxy || {}).files) {
        const filesPath = typeof options.proxy.files === 'string' ? options.proxy.files : 'default'
        proxies[`/sites/${filesPath}/files`] = options.baseUrl
      }
      const pathRewrite:any = {}
      const pathFilter:string[] = []
      Object.keys(proxies).forEach((path) => {
        pathRewrite['^' + path] = path
        pathFilter.push(path)
      })
      await installModule('@pinia/nuxt')
      await installModule('nuxt-proxy', {
        options: {
          target: options.baseUrl,
          changeOrigin: true,
          autoRewrite: true,
          pathRewrite,
          pathFilter
        }
      })
    }

    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({ path: resolve('./runtime/components'), global: true })
    })

    // options.cli.badgeMessages.push(`${chalk.blue.bold('Druxt')} @ v${meta.version}`)
    // options.cli.badgeMessages.push(`${chalk.bold('API:')} ${chalk.blue.underline(options.baseUrl + options.endpoint)}`)
  }
})

export default DruxtNuxtModule

/**
 * Module options object.
 *
 * @typedef {object} ModuleOptions
 * @property {string} baseUrl - The Base URL of the Drupal JSON:API backend.
 * @property {string} [endpoint=/jsonapi] - The JSON:API endpoint path.
 * @property {object} [proxy] - Proxy settings object.
 * @property {boolean} [proxy.api] - Proxy the JSON:API.
 * @property {(boolean|string)} [proxy.files] - Proxy Drupal's site files directory. Provide String to specify multi-site path.
 *
 * @example @lang js
 * export default {
 *   modules: ['druxt'],
 *   druxt: {
 *     baseUrl: 'https://demo-api.druxtjs.org',
 *     endpoint: '/jsonapi',
 *     proxy: {
 *       api: true,
 *       files: 'default'
 *     }
 *   }
 * }
 */
