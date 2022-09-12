<template>
  <img src="{{src}}">
</template>
<script lang="ts">
import {useEntity, useEntityRender} from "../composables/useEntity";

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
    const media = await useEntity({type: props.item.type, uuid: props.item.id, lang: props.lang});
    return {
      src: ""
    };
  }
}
</script>
