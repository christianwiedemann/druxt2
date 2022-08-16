<template>
  <NuxtLink :to="to">{{ title }}</NuxtLink>
</template>
<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
</script>
