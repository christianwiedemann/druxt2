<template>
  <div>
    Demo:
    <DruxtDemo />
    End:
  </div>
</template>


<script>
import DruxtDemo from '../../src/runtime/components/DruxtDemo.vue';
export default {
  components: {
    DruxtDemo
  },

  setup() {
    return {'hello': 'world'}
  }
}
</script>

<style scoped>
dl dt {
  font-weight: bold;
}
</style>
