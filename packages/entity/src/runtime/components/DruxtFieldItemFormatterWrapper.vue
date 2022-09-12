<template>
  <div>{{item}}</div>
</template>
<script lang="ts">
import {useComponent, render} from "#imports";

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
