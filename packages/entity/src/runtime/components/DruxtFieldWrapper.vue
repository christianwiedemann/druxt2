<script lang="ts">
import {h, resolveComponent} from "vue";
import {useComponent, render} from "#imports";

export default {
  computed: {
    /**
     * The Field data.
     *
     * @type {(array|boolean|number|object|string)}
     */
    data: ({model}) => model,

    /**
     * Field is Boolean?
     *
     * @type {boolean}
     */
    isBoolean: ({schema}) => ['boolean_checkbox'].includes(schema.type),

    /**
     * Field is DateTime?
     *
     * @type {boolean}
     */
    isDateTime: ({schema}) => ['datetime_timestamp'].includes(schema.type),

    /**
     * Field is File?
     *
     * @type {boolean}
     */
    isFile: ({schema}) => ['file_default', 'file_generic'].includes(schema.type),

    /**
     * Field is Image?
     *
     * @type {boolean}
     */
    isImage: ({schema}) => ['image', 'image_image', 'responsive_image'].includes(schema.type),

    /**
     * Field is Link?
     *
     * @type {boolean}
     */
    isLink: ({schema}) => ['link'].includes(schema.type),

    /**
     * Field is multi-cardinality.
     *
     * @type {boolean}
     */
    isMultiple: ({schema}) => (schema.cardinality || 1) !== 1,

    /**
     * Field is Text?
     *
     * @type {boolean}
     */
    isText: ({schema}) => ['number_integer', 'string_textfield'].includes(schema.type),

    /**
     * The Field label display settings.
     *
     * @type {object}
     * @default { position: 'hidden' }
     */
    label: ({schema}) =>
        schema.config.schemaType === 'form'
            ? {...schema.label, text: (schema.label || {}).text || schema.id[0].toUpperCase() + schema.id.substring(1)}
            : ((schema || {}).label || {}).text
                ? schema.label
                : {position: 'hidden'},
  },
  props: {

    lang: {
      type: String,
      required: false
    },

    model: {
      type: Object,
      required: true
    },

    /**
     * `true` if this field is a JSON:API relationship.
     *
     * @type {boolean}
     * @default false
     */
    relationship: {
      type: Boolean,
      default: false
    },

    /**
     * Drupal Field schema object.
     *
     * @type {object}
     */
    schema: {
      type: Object,
      required: true
    },

    /**
     * The Field value.
     *
     * @type {(array|boolean|number|object|string)}
     * @model
     */
    value: {
      type: [Array, Boolean, Number, String, Object],
      default: undefined,
    },
  },

  render() {

    const slots = this.slots();

    const component = useComponent('DruxtField', [[]], {})
    return render(component, slots);
  },
  /**
   * Provides the scoped slots object for the Module render function.
   *
   * A scoped slot per field item is provided, with support for:
   * - File, Image, Link, Number, Text and other View fields.
   * - Boolean, Date/Time, Text and other Form fields.
   * - Entitiy references.
   *
   * A scoped slot is provided for the label, as well as label-above and
   * label-inline depending on the field schema.
   *
   * A default slot is provided with debug information if Nuxt is in
   * development mode.
   *
   * @example <caption>DruxtField**SchemaType**.vue</caption> @lang vue
   * <template>
   *   <div>
   *     <slot name="label" />
   *     <slot name="field-0" />
   *   </div>
   * </template>
   *
   * @return {ScopedSlots} The Scoped slots object.
   */
  methods: {
    slots() {
      const scopedSlots = {}
      const {schemaType} = ((this.schema || {}).config || {})
      const self = this

      // Label(s).
      if ((this.label || {}).text) {
        scopedSlots.label = (attrs) => h('strong', {attrs}, [`${this.label.text}:`])
        if (this.label.position && ['above', 'inline'].includes(this.label.position)) {
          scopedSlots[`label-${this.label.position}`] = scopedSlots.label
        }
      }

      const items = (this.model || {}).data
          ? Array.isArray(this.model.data) ? this.model.data : [this.model.data]
          : Array.isArray(this.model) ? this.model : [this.model]

      // Render a slot for each field delta.
      for (const delta in items) {
        const setModel = (value, fallback = undefined) => {
          value = value || fallback
          self.relationship
              ? self.isMultiple
                  ? self.model.data[delta] = value
                  : self.model.data = value
              : self.isMultiple
                  ? self.model[delta] = value
                  : self.model = value
        }

        const item = items[delta]
        scopedSlots[`field-${delta}`] = (attrs) => {
          if (this.isFile && schemaType === 'view') {
            return h('DruxtEntityWrapper', {
                  attrs,
                  lang: this.lang,
                  type: item.type,
                  uuid: item.id,
                },
                {
                  default: ({entity}) => h('a', {
                    domProps: {
                      href: (entity.attributes.uri || {}).url,
                      target: '_blank',
                    },
                  }, [entity.attributes.filename])
                }
            )
          }

          // Image: View
          if (this.isImage && schemaType === 'view') {
            return h('DruxtEntityWrapper',
                {
                  attrs,
                  lang: this.lang,
                  type: item.type,
                  uuid: item.id
                },
                {
                  default: ({entity}) => h('img', {
                    domProps: {
                      src: (entity.attributes.uri || {}).url
                    }
                  })
                })
          }

          // Link: View.
          if (this.isLink && schemaType === 'view') {
            if (!(item || {}).uri) return
            return /^(?:[a-z]+:)?\/\//i.test(item.uri)
                ? h('a', {attrs, domProps: {href: item.uri, target: '_blank'}}, [item.title])
                : h('NuxtLink', {attrs, props: {to: item.uri.replace('internal:', '')}}, [item.title])
          }

          // Relationship: View.
          if (this.relationship && (item || {}).id && schemaType === 'view') {
            if (this.schema.type === 'entity_reference_label') {
              const resolvedDruxtLabelWrapper = resolveComponent('DruxtEntityLabelWrapper')
              return h(resolvedDruxtLabelWrapper, {
                attrs,
                lang: this.lang,
                type: item.type,
                uuid: item.id,
              })
            } else {
              const resolvedDruxtEntityWrapper = resolveComponent('DruxtEntityWrapper')
              return h(resolvedDruxtEntityWrapper, {
                attrs,
                lang: this.lang,
                viewMode: this.schema.settings.display.view_mode || 'default',
                type: item.type,
                uuid: item.id,
              })
            }
          }


          // Fallback: View.
          if (schemaType === 'view') {
            // Return data if data is a basic native.
            if (['number', 'string'].includes(typeof item)) {
              return h('div', {attrs, innerHTML: item})
            }

            // Return `.processed` or `.value` if present.
            if (((item || {}).processed || (item || {}).value)) {
              return h('div', {attrs, innerHTML: item.processed || item.value})
            }
          }

          const isDev = true;
          // Fallback: Provide debug data.
          if (isDev) {
            return h('DruxtDebug',
                {props: {summary: `Missing wrapper component for '${this.schema.id} (${this.schema.type}')`}},
                [
                  // h('label', ['Component options:', h('ul', this.component.options.map((s) => h('li', [s])))]),
                  h('label', ['Data:', h('pre', [JSON.stringify(item, null, '  ')])]),
                  h('label', ['Schema:', h('pre', [JSON.stringify(this.schema, null, '  ')])])
                ]
            )
          }
        }
      }

      // Default slot to add label to field as required.
      scopedSlots.default = (attrs) => {
        const fields = items.map((item, delta) => scopedSlots[`field-${delta}`](attrs))
        if (schemaType === 'form' && scopedSlots.label) {
          return h('label', [
            scopedSlots.label(attrs),
            h('br'),
            fields
          ])
        } else if (this.label.position && scopedSlots[`label-${this.label.position}`]) {
          return [scopedSlots[`label-${this.label.position}`](attrs), fields]
        }
        return [fields]
      }
      return scopedSlots
    },
  }


}
</script>