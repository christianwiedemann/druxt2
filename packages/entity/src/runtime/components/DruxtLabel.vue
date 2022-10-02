<template>
  <label>{{label}}</label>
</template>
<script lang="ts" setup>
const { label } = defineProps({
  label: {
    type: String,
    required: true
  },
})
</script>
