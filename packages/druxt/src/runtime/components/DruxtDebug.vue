
<template>
  <details>
      Debug:
    <summary v-text="title" />
    <pre v-if="json"><!--
      --><code>{{ JSON.stringify(json, null, '  ') }}</code><!--
    --></pre>
    <!-- @slot Debug content -->
    <slot />
  </details>

</template>

<script>
export default {
  /** */
  props: {
    /**
     * JSON data to format for readability.
     *
     * @type {*}
     * @example @lang vue
     * <DruxtDebug :json="{ data: [{ one: true, two: false }] }" />
     */
    json: {
      type: [Array, Boolean, Object, Number, String],
      default: undefined
    },
    title: {
      type: String
    }
  }
}
</script>
