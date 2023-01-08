<script lang="ts">
import {druxtTheme, druxtRender} from "#imports";
import {default as DruxtField} from "./DruxtField";
import {h} from "vue";
import {druxtEntityWrapperTheme} from "../composables/druxtEntityWrapperTheme";

export default {
  computed: {
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

    entity: {
      type: Object,
      required: true
    },

    lang: {
      type: String,
      required: false
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

  render(props) {
    const slots = {};
    if ((this.label || {}).text && (this.label || {}).position !== 'hidden') {
      slots['label'] = [];
      slots['label'].push(druxtTheme('DruxtLabel', [[]], {label: this.label.text, position: this.label.position}));
    }

    const items = (this.value || {}).data
        ? Array.isArray(this.value.data) ? this.value.data : [this.value.data]
        : Array.isArray(this.value) ? this.value : [this.value]
    slots[`items`] = [];
    for (const delta in items) {
      const item = items[delta]
      slots[`items`][delta] = druxtTheme('DruxtFieldItemFormatterWrapper', [[props.schema.type, props.schema.id]], {
        item,
        schema: props.schema,
        lang: this.lang,
        entity: props.entity,
        context: {entity: props.entity}
      }, {}, this.lang)
    }
    const component = druxtTheme('DruxtField', [[props.schema.type, props.schema.id]], {context: {entity: props.entity}}, slots, this.lang)

    return druxtRender(component);
  },
}
</script>
