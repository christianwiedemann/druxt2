<template>
  <img :src="src">
</template>

<script lang="ts" setup>
import {useEntityFieldFormatterProps} from "../composables/useEntityField";
import {useEntity} from "../composables/useEntity";
const props = defineProps(useEntityFieldFormatterProps())
const { item, lang } = props;
const prov = {type: item.type, uuid: item.id, lang};
const file = await useEntity(prov);
const src = file.attributes.uri.url
</script>
