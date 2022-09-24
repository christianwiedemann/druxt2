/**
 * @vuepress
 * ---
 * title: DruxtRouter
 * ---
 */

import { DruxtClient } from '@druxt2/core'

/**
 * DruxtRouter class.
 *
 * Provides core Drupal JSON:API query functionality.
 */
class DruxtRouter {
  /**
   * DruxtRouter constructor.
   *
   * - Validates module options.
   * - Sets up Axios instance.
   * - Sets up options.
   *
   * @example @lang js
   * const router = new DruxtRouter('https://example.com', {})
   *
   * @param {string} baseURL - The Drupal base URL.
   * @param {object} [options] - Druxt Router options.
   * @param {object} [options.axios] - Axios instance settings.
   * @param {string} [options.endpoint=jsonapi] - The JSON:API endpoint.
   * @param {array} [options.types] - Array of Druxt Router type definitions.
   */
  constructor (baseUrl, options = {}) {
    /**
     * Druxt router options.
     * @type {object}
     * @private
     */
    this.options = {
      types: [
        {
          type: 'entity',
          canonical: route => route.entity.canonical,
          component: 'druxt-entity',
          property: 'entity',
          props: route => ({
            langcode: route.entity.langcode,
            type: route.jsonapi.resourceName,
            uuid: route.entity.uuid
          })
        },
        {
          type: 'views',
          canonical: route => route.resolved,
          component: 'druxt-view',
          property: 'view',
          props: route => ({
            displayId: route.view.display_id,
            langcode: route.view.langcode || undefined,
            type: route.jsonapi.resourceName,
            uuid: route.view.uuid,
            viewId: route.view.view_id
          })
        }
      ],

      ...options
    }

    this.baseUrl = baseUrl;

    /**
     * Instance of the Druxt Client.
     *
     * @type {DruxtClient}
     * @see {@link http://druxtjs.org/api/client}
     */
    this.druxt = new DruxtClient(baseUrl, this.options)

    this.axios = this.druxt.axios
  }

  /**
   * Returns route and redirect data for a given path.
   *
   * @example @lang js
   * const { redirect, route } = await router.get('/node/1')
   *
   * @param {string} path - The route path.
   *
   * @returns {object} The route and redirect data.
   */
  async get (path) {
    const route = await this.getRoute(path)
    const redirect = await this.getRedirect(path, route)
    console.log('REDIRECT: ', redirect)
    return { redirect, route }
  }

  /**
   * Get redirect data for a given route.
   *
   * @example @lang js
   * const route = await router.getRoute(path)
   * const redirect = router.getRedirect(path, route)
   *
   * @todo Move this to a DruxtRouterRedirect class.
   * @todo Remove the path parameter.
   *
   * @param {string} path - The route path.
   * @param {object} route - Druxt route object.
   *
   * @returns {boolean|string} The redirect path or false.
   */
  getRedirect (path, route = {}) {
    const prefix = (route.props || {}).langcode || ''

    // Redirect to route provided redirect.
    if (((route.redirect || [])[0] || {}).to) {
      return route.redirect[0].to
    }
    const url = new URL(path, this.baseUrl)

    // Redirect to root if route is home path but path isn't root.
    if (route.isHomePath) {
      const homePath = prefix ? `/${prefix}` : '/'
      if (!(url.pathname === homePath || url.pathname === `${homePath}/`)) {
        return homePath
      }
      return false
    }

    // Redirect if path does not match resolved clean url path.
    if (typeof route.canonical === 'string') {
      const canonicalUrl = new URL(route.canonical, this.baseUrl)

      if (url.pathname !== canonicalUrl.pathname) {
        return canonicalUrl.pathname
      }
    }

    return false
  }

  /**
   * Get a JSON:API resource by Drupal route.
   *
   * @example @lang js
   * const route = await router.getRoute('/')
   * const data = await router.getResourceByRoute(route)
   *
   * @param {object} route - Druxt Router route object.
   *
   * @returns {object} The JSON:API resource data.
   */
  async getResourceByRoute (route) {
    const resource = await this.druxt.getResource(route.jsonapi.resourceName, route.entity.uuid, route.prefix)
    return resource.data || false
  }

  /**
   * Get routing data from Decoupled Router.
   *
   * @example @lang js
   * const route = await router.getRoute('/')
   *
   * @param {string} path - The route path.
   *
   * @returns {object} The route object.
   */
  async getRoute (path = '/') {
    // @TODO - Add validation/error handling.
    const url = `/router/translate-path?path=${path}`

    const response = await this.druxt.get(url, {
      // Prevent invalid routes (404) from throwing validation errors.
      validateStatus: status => status < 500
    })

    const data = {
      isHomePath: false,
      jsonapi: {},
      label: false,
      redirect: false,

      ...response.data
    }
    let route = {
      error: false,
      type: false,
      canonical: false,
      component: false,
      isHomePath: data.isHomePath,
      jsonapi: data.jsonapi,
      label: data.label,
      props: false,
      redirect: data.redirect,
      resolvedPath: data.resolved ? new URL(data.resolved).pathname : null,
      entity: data.entity
    }

    // Determine route type by configuration.
    // @TODO - Move type to Decoupled router.
    // @SEE  - https://www.drupal.org/project/decoupled_router/issues/3146024
    for (const key in this.options.types) {
      const type = {
        ...this.options.types[key]
      }

      if (typeof type.property !== 'string' || typeof data[type.property] === 'undefined') {
        continue
      }
      delete type.property

      // Construct canonical link.
      if (typeof type.canonical === 'function') {
        type.canonical = type.canonical(data)
      }

      // Construct props.
      if (typeof type.props === 'function') {
        type.props = type.props(data)
      }

      // Merge type
      route = {
        ...route,
        ...type
      }
      break
    }

    console.log('fetch Route. Path: ' + path)
    // Process Axios error.
    if (!(response.status >= 200 && response.status < 300)) {
      // Handle 404 errors.
      if (response.status === 404) {
        // Is the Decoupled Router installed?
        if (typeof response.data !== 'object') {
          response.data = { errors: [{
            detail: 'Please ensure the Decoupled Router module is installed and configured correctly.'
          }]}
        }
        // Has the Decoupled Router provided an error message?
        else if (response.data.message || response.data.details) {
          response.data.errors = [{ detail: [response.data.message, response.data.details].filter((s) => s).join('\n') }]
        }
      }

      // Throw error.
      this.druxt.error({ response }, { url })
    }
    return route
  }
}

export { DruxtRouter }
