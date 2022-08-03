import {defineStore} from 'pinia'
import {useNuxtApp} from "#app";

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
        const { $druxtRouter } = useNuxtApp();
        this.routes[path] = await $druxtRouter().getRoute(path)
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
