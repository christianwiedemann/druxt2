<template>
  {{item}}
</template>
<script lang="ts">
import { useEntityFieldFormatterProps } from "../composables/useEntityField";
const { item } = defineProps(useEntityFieldFormatterProps())
</script>
