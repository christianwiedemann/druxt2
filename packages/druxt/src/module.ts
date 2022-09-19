import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import { defineNuxtModule, createResolver, extendViteConfig, addImports, resolveModule } from '@nuxt/kit'
import { DruxtClient } from '@druxt2/core'

interface ProxyInterface {
  api: Boolean
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
      files: 'default'
    },
    baseUrl: '',
    endpoint: '/jsonapi'
  },

  async setup (moduleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const resolveRuntimeModule = (path: string) => resolveModule(path, { paths: resolve('./runtime') })
    const options: any = {
      ...(moduleOptions || {})
    }

    // Register composables
    addImports([
      { name: 'DruxtStore', as: 'DruxtStore', from: resolveRuntimeModule('./stores/druxt') },
      { name: 'useDruxtClient', as: 'useDruxtClient', from: resolveRuntimeModule('./composables/useDruxtClient') },
      { name: 'druxtTheme', as: 'druxtTheme', from: resolveRuntimeModule('./composables/druxtTheme') },
      { name: 'druxtRender', as: 'druxtRender', from: resolveRuntimeModule('./composables/druxtRender') }
    ])

    // Normalize slashes.
    options.baseUrl = options.baseUrl = options.baseUrl.endsWith('/') ? options.baseUrl.slice(0, -1) : options.baseUrl
    options.endpoint = options.endpoint = options.endpoint.startsWith('/') ? options.endpoint : `/${options.endpoint}`
    options.query = options.query ?? null
    // Provide runtime configuration
    nuxt.options.runtimeConfig.public.baseUrl = options.baseUrl
    nuxt.options.runtimeConfig.public.endpoint = options.endpoint
    nuxt.options.runtimeConfig.public.options = {
      ...options,
      // Disable API Proxy, as Proxies aren't available at build.
      proxy: { ...options.proxy || {}, api: false }
    }

    const { $fetch } = require('ohmyfetch')
    const druxt = new DruxtClient(options.baseUrl, $fetch, {} )

    // Nuxt proxy integration.
    if (options.proxy) {
      const proxies = {}

      // Enable proxying of the API endpoint.
      // This is primarily used to avoid CORS errors.
      if ((options.proxy || {}).api) {
        // Main API Endpoint.
        proxies[options.endpoint] = options.baseUrl

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
      // If there are existing proxy settings, merge in the appropriate format.
      if (options.proxy) {
        if (Array.isArray(options.proxy)) {
          options.proxy = [
            ...options.proxy,
            ...Object.keys(proxies).map(path => `${options.baseUrl}${path}`)
          ]
        } else {
          options.proxy = {
            ...options.proxy,
            ...proxies
          }
        }
      }
      // Otherwise just set the the required proxies.
      else {
        options.proxy = proxies
      }
      // Optimize cross-fetch
      extendViteConfig((config) => {
        config.server.proxy = {}

        Object.keys(proxies).forEach((key) => {
          config.server.proxy[key] = {
            target: proxies[key],
            changeOrigin: true,
            ws: true
          }
        })
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
