<template>
  Demo Component
</template>
<script setup>
  import {useRuntimeConfig} from "#app";

  const runtimeConfig = useRuntimeConfig();
  console.log(runtimeConfig.public.baseUrl);
</script>
