import { defineStore } from 'pinia'
import {useDruxtMenu} from "../composables/useDruxtMenu";

const DruxtMenuStore = defineStore({
  id: 'druxt-menu-store',

  state: () => ({
    entities: {},
  }),
  /**
   * Actions.
   */
  actions: {
    /**
     * Get menu by name.
     *
     * - Fetches the menu items from the JSON:API endpoint.
     * - Commits the menu items to the Vuex state object.
     *
     * @name get
     * @action get=entities
     * @param {object} app - The Nuxt app context.
     * @param {string|object} context - The Menu name or context object.
     *
     * @example @lang js
     * await this.$store.dispatch('druxtMenu/get', { name: 'main' })
     */
    async get ( context ) {
      const { name, settings, prefix  } = typeof context === 'object'
        ? context
        : { name: context }

      const { entities } = (await useDruxtMenu().get(name, settings, prefix)) || {}
      this.addEntities(entities, prefix)
    },

    /**
     * @name addEntities
     * @mutator {object} addEntities=entities Adds specified Drupal JSON:API Menu Items data to the Vuex state object.
     * @param {State} state - The Vuex State object.
     * @param {object} entities - The Drupal JSON:API Menu Item entities.
     *
     * @example @lang js
     */
    addEntities ( entities, prefix = null) {
      if (!this.entities[prefix]) this.entities[prefix] = {};
      const x = this.entities;
      for (const index in entities) {
        const entity = entities[index]
        this.entities[prefix][entity.id] = entity;
      }
    },

    /**
     * @name getEntitiesByFilter
     * @mutator {object} getEntitiesByFilter=entities Adds specified Drupal JSON:API Menu Items data to the Vuex state object.
     * @param {State} state - The Vuex State object.
     * @param {object} entities - The Drupal JSON:API Menu Item entities.
     *
     * @example @lang js
     */
    getEntitiesByFilter ( filter, prefix = null )  {
      const keys = Object.keys((this.entities || {})[prefix]).filter(key => filter(key, this.entities, prefix))
      if (!keys.length) return {}

      return Object.assign(
        ...keys.map(key => ({ [key]: this.entities[prefix][key] }))
      )
    }
  }
});

export { DruxtMenuStore }
