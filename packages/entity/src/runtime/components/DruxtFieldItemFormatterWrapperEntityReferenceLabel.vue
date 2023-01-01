<template>
  <div>{{ label }}</div>
</template>
<script lang="ts" setup>
import { useEntityFieldFormatterProps } from "../composables/useEntityField";
import { useEntity } from "../composables/useEntity";
const { item, lang } = defineProps(useEntityFieldFormatterProps());
const entity = await useEntity({type: item.type, uuid: item.id, lang})
const label = entity ? entity.attributes?.title : ''
</script>
