<template>
  Demo Component

  Slots:
  <slot name="content"></slot>
</template>
<script setup>
  import {useRuntimeConfig} from "#app";

  const runtimeConfig = useRuntimeConfig();
</script>
