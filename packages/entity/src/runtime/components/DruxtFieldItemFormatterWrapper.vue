<template>
  {{ item }}
</template>
<script lang="ts" setup>
import { useEntityFieldFormatterProps } from "../composables/useEntityField";
const { item } = defineProps(useEntityFieldFormatterProps())
</script>
