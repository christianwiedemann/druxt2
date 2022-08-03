/**
 * The core module functionality.
 *
 * Provides methods for generating Druxt.js Schema files from the Drupal JSON:API.
 *
 * @type class
 * @exports DruxtSchema
 * @see {@link /api/packages/schema/schema|DruxtSchema}
 *
 * @example @lang js
 * import { DruxtSchema } from 'druxt-schema'
 * const druxtSchema = new DruxtSchema('https://example.com', {})
 */
export { DruxtSchema } from './schema'

/**
 * The Vuex store module.
 *
 * Contains actions for interacting with and caching the generated Schema files.
 *
 * @exports DruxtSchemaStore
 * @type {Function}
 * @see {@link /api/packages/schema/store/schema|DruxtSchemaStore}
 */
export { DruxtSchemaStore } from './stores/schema'

/**
 * Vue.js Mixin.
 *
 * Adds required props and methods for lazy-loaded Schema support to custom Vue.js components.
 *
 * @exports DruxtSchemaMixin
 * @type {object}
 * @see {@link /api/packages/schema/mixins/schema|DruxtSchemaMixin}
 *
 * @example @lang vue
 * <script>
 * import { DruxtSchemaMixin } from 'druxt3-schema'
 * export default {
 *   mixins: [DruxtSchemaMixin]
 * }
 * </script>
 */
export { DruxtSchemaMixin } from './mixins/schema'
