<template>
  <div><DruxtDebug :json="route"></DruxtDebug></div>
  Path: {{ path }}<br>
  language: {{ language }}

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
