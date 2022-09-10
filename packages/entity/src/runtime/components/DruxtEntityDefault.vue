<template>
  <div>Entity</div>
  <slot name="field_difficulty"></slot>
  <slot name="field_media_image"></slot>
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
