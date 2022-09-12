<template>
  <div v-html="html"></div>

</template>
<script lang="ts">

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
    const { item } = props;
    return {
      html: item.processed || item.value
    };
  }
}
</script>
