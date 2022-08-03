import { defineNuxtPlugin } from '#app'

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
      importSchema: async id => {

        const result = await import(`../../schemas/${id}.json`)
          .then(m => m.default || m)
          .catch(async (err) => {
            const parts = id.split('--')
            // Error if there's no default view mode.
            if (parts[parts.length - 2] === 'default') throw err
            // Fallback to the default view mode.
            parts[parts.length - 2] = 'default'
            return import(`../../schemas/${parts.join('--')}.json`).then(m => m.default || m)
          });
        return result;
      }
    }
  }
})

