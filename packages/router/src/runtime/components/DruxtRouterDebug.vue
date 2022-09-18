<template>
  <div><DruxtDebug></DruxtDebug></div>
  Path: {{ path }}<br>

</template>

<script>
import { DruxtRouterMixin } from '@druxt2/router/mixins'

export default {
  mixins: [DruxtRouterMixin],
  setup (props) {
    console.log('DEBUG DEMO')
  }
}
</script>
