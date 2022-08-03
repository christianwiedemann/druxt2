<script lang="ts">

import { h } from 'vue'

import DruxtWrapper from './DruxtWrapper.vue'

/**
 * The DruxtModule component is used to make a Druxt module, simply import and
 * extend the component to get started.
 *
 * The component provides access to the Druxt Wrapper theming and fetch system
 * via the druxt settings object.
 *
 * @example @lang js
 * import DruxtModule from 'druxt/dist/components/DruxtModule.vue'
 * export default {
 *   name: 'DruxtTestModule',
 *   extends: DruxtModule,
 *   druxt: {
 *     async fetchConfig() {},
 *     async fetchData(settings) {},
 *     componentOptions: (context) => ([[context.foo, context.bar, 'default']]),
 *     propsData: (context) => ({
 *       foo: context.foo,
 *       bar: context.bar,
 *     }),
 *     slots(h) {
 *       return {
 *         default: (attrs) => h('DruxtDebug', ['Hello world'])
 *       }
 *     }
 *   }
 * }
 */
export default {
  components: { DruxtWrapper },

  /** */
  props: {
    /**
     * The resource langcode.
     *
     * @example
     * <DruxtModule langcode="en" />
     *
     * @type {string}
     */
    langcode: {
      type: String,
      default: undefined
    },

    /**
     * The module component model value.
     *
     * Used to bypass the Drupal JSON:API fetch, setting the module data
     * directly.
     *
     * @example
     * <DruxtModule v-model="{ foo: bar }" />
     *
     * @type {*}
     * @model
     */
    value: {
      type: [Array, Boolean, Date, Number, Object, String],
      default: null
    },

    /**
     * The wrapper component configuration.
     *
     * Used to set the wrapper component, class, style and propsData.
     *
     * @example
     * <DruxtModule
     *   :wrapper="{
     *     component: 'MyWrapper',
     *     class: 'wrapper',
     *     propsData: { foo: 'bar' }
     *   }"
     * />
     *
     * @type {(boolean|object)}
     */
    wrapper: {
      type: [Boolean, Object],
      default: () => undefined
    }
  },

  /**
   * Loads the Druxt module data and applies a wrapper component as required.
   *
   * **Important:** If your component has an existing `fetch` method, you must manually invoke
   * the `DruxtModule.fetch()` hook.
   *
   * @example @lang js <caption>Manually invoking DruxtModule.fetch().</caption>
   * import DruxtModule from 'druxt/dist/components/DruxtModule.vue'
   * export default {
   *   name: 'DruxtTestModule',
   *   extends: DruxtModule,
   * }
   */
  setup () {
    // Set component data.
    return {
      component: {
        is: 'DruxtWrapper'
      },
      wrapper: {
        is: 'DruxtWrapper'
      }
    }
  },

  /**
   * @property {ComponentData} component - The wrapper component and propsData to be rendered.
   * @property {object} model - The model object.
   */
  data: ({ value }) => ({
    component: {
      $attrs: {},
      is: 'DruxtWrapper',
      options: [],
      props: {},
      propsData: {},
      settings: {},
      slots: []
    },
    model: value
  }),

  computed: {
    lang: ({ langcode, $route }) => langcode || ($route.meta || {}).langcode
  },


  /** */
  render () {
    return h(this.wrapper.is, {}, [
      h(this.component.is, {
        attrs: this.attrs,
        props: this.component.props,
        scopedSlots: this.getScopedSlots()
      })
    ])
  }
}

</script>
