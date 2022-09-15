<template>
  <label>{{label}}</label>
</template>
<script lang="ts">

export default {
  props: {
    label: {
      type: String,
      required: false
    },
  }
}
</script>
