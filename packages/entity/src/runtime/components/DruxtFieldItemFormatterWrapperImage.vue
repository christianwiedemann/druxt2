<template>
  <img :src="src">
</template>
<script lang="ts">
import {useEntity} from "../composables/useEntity";

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    schema: {
      type: Object,
      required: true
    },
    lang: {
      type: String,
      required: true
    },
  },
  async setup(props) {
    const file = await useEntity({type: props.item.type, uuid: props.item.id, lang: props.lang});
    return {
      src: file.attributes.uri.url
    };
  }
}
</script>
