import {defineNuxtPlugin, useRuntimeConfig} from '#app'
import {DruxtRouter} from "../router";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      /**
       * Import a generated Drupal.js Schema by ID.
       *
       * @param {string} id - The Druxt.js Schema ID.
       * @returns {Schema} The generated Druxt.js Schema object.
       *
       * @example @lang js
       * const schema = await this.$druxtSchema.import('node--page--default--view')
       */
      druxtRouter: async  => {
        const runtimeConfig = useRuntimeConfig();
        const baseUrl = runtimeConfig.public.baseUrl;
        const router = new DruxtRouter(baseUrl);

        return router;
      }
    }
  }
})

