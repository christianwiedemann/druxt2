import { defineStore } from 'pinia'
import { useDruxtRouter } from "../composables/useDruxtRouter";

const DruxtRouterStore = defineStore({
  id: 'druxt-router-store',
  state: () => ({
    entities: {},
    redirect: false,
    route: {},
    routes: {}
  }),

  /**
   * Vuex Actions.
   */
  actions: {
    /**
     * @name setRedirect
     * @param {object} redirect - The Redirect object.
     */
    setRedirect (redirect) {
      this.redirect = redirect
    },

    /**
     * Get route and redirect information.
     *
     * - Dispatches `druxtRouter/getRoute` action.
     * - Sets the active route.
     * - Sets the active redirect.
     *
     * @name get
     * @action get=route
     * @param {string} path The router path.
     * @return {object} The route and redirect information.
     *
     * @example @lang js
     * const { redirect, route } = await this.$store.dispatch('druxtRouter/get', '/')
     */
    async get (path, router = null) {
      // Get route by path from 'getRoute'.
      const route = await this.getRoute(path)
      // Handle route errors.
      if (route.error && typeof route.error.statusCode !== 'undefined' && ((this.app || {}).context || {}).error) {
        return this.app.context.error(route.error)
      }
      const druxtRouter = router ?? useDruxtRouter();
      // Set active redirect.
      const redirect = druxtRouter.getRedirect(path, route)
      this.setRedirect(redirect)

      return { redirect, route }
    },

    /**
     * Get Route.
     *
     * - Executes query against Drupal Decoupled router.
     * - Caches result in the Vuex store.
     * - Returns cached result from Vuex store when available.
     *
     * @name getRoute
     * @action getRoute=route
     * @param {string} path - The route path.
     * @return {object} The route object.
     *
     * @example @lang js
     * const route = await this.$store.dispatch('druxtRouter/getRoute', '/')
     */
    async getRoute( path) {
      if (typeof this.routes[path] !== 'undefined') {
        return this.routes[path]
      }

      try {
        const route = await useDruxtRouter().getRoute(path);
        this.routes[path] = route;
      } catch (err) {
        this.routes[path] = {error: {statusCode: err.response.status, message: err.response.data.message}}
      }
      this.setRoute(path);
      return this.route
    },
    setRoute (path) {
      if (typeof path !== 'string' || typeof this.routes[path] === 'undefined') {
        // @TODO - Error?
        return
      }
      this.route = this.routes[path]
    }
  }
})


export {DruxtRouterStore}
