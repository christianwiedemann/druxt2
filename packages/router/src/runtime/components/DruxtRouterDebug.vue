<template>
  <div>
    Path: {{ path }}<br>
  </div>
</template>
<script setup>
 defineProps({
   path: {
     type: String
   }
 })
</script>
