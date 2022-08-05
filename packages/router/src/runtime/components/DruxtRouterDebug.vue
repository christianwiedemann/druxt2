<template>
  <div><DruxtDebug :json="route"></DruxtDebug></div>
  Path: {{ path }}<br>
  language: {{ language }}

</template>

<script>
import { DruxtRouterMixin } from 'druxt3-router/mixins'

export default {
  mixins: [DruxtRouterMixin],
  setup (props) {
    console.log(props)
    const path = ref(props.path);
    console.log('DEBUG DEMO')
  }
}
</script>
