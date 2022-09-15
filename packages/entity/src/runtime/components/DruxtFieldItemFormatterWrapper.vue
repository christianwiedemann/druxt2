<template>
  <div>{{item}}</div>
</template>
<script lang="ts">

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    schema: {
      type: Object,
      required: true
    },
  }
}
</script>
