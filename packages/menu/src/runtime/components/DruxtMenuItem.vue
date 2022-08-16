<template>
  <div>
    <li :class="classes"><slot name="link"></slot></li>
    <slot name="children"></slot>
  </div>
</template>
<script>
export default {
  name: 'DruxtMenuItem',

  /** */
  props: {
    /**
     * The menu item.
     *
     * @type {object}
     * @required
     */
    classes: {
      type: String,
      required: false
    }
  },
}
</script>
