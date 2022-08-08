<template>
  <slot name="body"></slot>
</template>
<script>

export default {
  async setup(props) {
    const entity = props.entity;
    const viewMode = props.viewMode;
    return {
      entity
    }
  }
}
</script>
