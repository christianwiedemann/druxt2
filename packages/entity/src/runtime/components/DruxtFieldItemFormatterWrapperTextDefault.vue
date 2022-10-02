<template>
  <div v-html="html"></div>
</template>

<script lang="ts" setup>
import {useEntityFieldFormatterProps} from "../composables/useEntityField";
const props = defineProps(useEntityFieldFormatterProps())
const { item } = props;
const html = item.processed || item.value;
</script>
