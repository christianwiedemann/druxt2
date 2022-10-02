<template>
  {{item}}
</template>
<script lang="ts">
import { defineProps } from "vue";
import { useEntityFieldFormatterProps } from "../composables/useEntityField";
const { item } = defineProps(useEntityFieldFormatterProps())
</script>
