<template>
  <button @click="login">Login</button>
</template>
<script lang="ts" setup>
import {useNuxtApp} from "#app";

const app = useNuxtApp();
const login = () => {
  app.$auth.reset();
  app.$auth.loginWith('drupal',{params: {'redirect': '/dynamic'}});
}
</script>
