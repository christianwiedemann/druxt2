import { mapActions } from 'pinia'

/**
 * Lazy loads a schema into the Vuex State object.
 *
 * @mixin
 *
 * @example @lang vue
 * <script>
 * import { DruxtSchemaMixin } from 'druxt3-schema/runtime'
 * export default {
 *   mixins: [DruxtSchemaMixin],
 * }
 * </script>
 */
const DruxtSchemaMixin = {
  /** */
  props: {
    /**
     * The Drupal Display mode.
     *
     * @type {string}
     * @default default
     */
    mode: {
      type: String,
      default: 'default'
    },

    /**
     * Drupal display schema type, 'view' or 'form'.
     *
     * @type {('view'|'form')}
     */
     schemaType: {
      type: String,
      default: undefined,
    },

    /**
     * The JSON:API Resource type.
     *
     * @type {string}
     */
    type: {
      type: String,
      required: true
    },
  },

  /**
   * @property {object} schema - The Drupal Schema data.
   */
  data: () => ({
    schema: false
  }),

}

export { DruxtSchemaMixin }
