<template>
  <label>{{label}}</label>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
const { label } = defineProps({
  label: {
    type: String,
    required: true
  },
})
</script>
