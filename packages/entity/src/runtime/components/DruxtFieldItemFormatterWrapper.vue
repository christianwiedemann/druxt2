<template>
  <div>{{item}}</div>
</template>
<script lang="ts">

export default {
  props: {
    item: {
      type: [Array, Boolean, Number, String, Object],
      required: true
    },
    schema: {
      type: Object,
      required: true
    },
    lang: {
      type: String,
      required: true
    },
    entity: {
      type: Object,
      required: true
    },
  }
}
</script>
