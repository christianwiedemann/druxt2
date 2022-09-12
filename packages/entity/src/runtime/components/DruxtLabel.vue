<template>
  <label>{{label}}</label>
</template>
<script lang="ts">
import {h} from "vue";
import {useComponent, render} from "#imports";

export default {
  props: {
    label: {
      type: String,
      required: false
    },
  }
}
</script>
