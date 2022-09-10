import md5 from 'md5'

import { defineStore } from 'pinia'
import {useDruxtClient} from "#imports";


const DruxtViewsStore = defineStore({
  id: 'druxt-views-store',

  state: () => ({
    results: {},
  }),

  /**
   * Actions.
   */
  actions: {
    /**
     * @name addResults
     * @mutator {object} addResults=results Adds JSON:API Views results to the Vuex state object.
     * @param {object} results - The JSON:API Views results.
     *
     * @example @lang js
     * this.$store.commit('druxt/views/addResults', { results, viewId, displayId, prefix, hash })
     */
    addResults ({results, viewId, displayId, prefix, hash} ) {
      if (!results || !viewId || !displayId || !hash) return

      if (!this.results[viewId]) this.results[viewId] = {}
      if (!this.results[viewId][displayId]) this.results[viewId][displayId] = {};
      if (!this.results[viewId][displayId][prefix]) this.results[viewId][displayId][prefix] = {}
    },

    /**
     * Get View results.
     *
     * - Executes query against Drupal JSON:API.
     * - Caches result in the Vuex store.
     * - Returns cached result from Vuex store when available.
     *
     * @name getResults
     * @action get=results
     * @param {object} query The View results query object
     * @return {object} The JSON:API Views results resource.
     *
     * @example @lang js
     * const { data, meta, links } = await this.$store.dispatch('druxt/view/getResults', {
     *   viewId,
     *   displayId,
     *   query
     * })
     */
    async getResults ({ viewId, displayId, query, prefix, druxtClient }) {
      const hash = query ? md5(druxtClient.buildQueryUrl('', query)) : '_default'
      if (typeof (((this.results[viewId] || {})[displayId] || {})[prefix] || {})[hash] !== 'undefined') {
        return this.results[viewId][displayId][prefix][hash]
      }

      const results = await druxtClient.getResource(`views--${viewId}`, displayId, query, prefix)
      this.addResults({results, viewId, displayId, prefix, hash});
      return results
    }

  }
})

export { DruxtViewsStore }
