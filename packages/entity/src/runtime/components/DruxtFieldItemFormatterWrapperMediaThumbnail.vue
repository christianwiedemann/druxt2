<template>
  <img :src="src">
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import {useEntityFieldFormatterProps} from "../composables/useEntityField";
import {useEntity} from "../composables/useEntity";
const props = defineProps(useEntityFieldFormatterProps())
const { item, lang } = props;
const media = await useEntity({type: item.type, uuid: item.id, lang});
console.log("MEDIA: ", item, media);
</script>
