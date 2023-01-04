<template>
  <button @click="logout">Logout</button>
</template>
<script lang="ts" setup>
import {useNuxtApp} from "#app";

const app = useNuxtApp();
const logout = () => {
  app.$auth.reset();
  app.$auth.logout();
  window.location.reload(true)
}
</script>
