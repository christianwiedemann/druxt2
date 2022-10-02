<template>
  {{label}}
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
import {useEntityFieldFormatterProps} from "../composables/useEntityField";
import {useEntity} from "../composables/useEntity";
const { item, lang } = defineProps(useEntityFieldFormatterProps());
const entity = await useEntity({type: item.type, uuid: item.id, lang})
const label = entity ? entity.attributes?.title : ''
</script>
