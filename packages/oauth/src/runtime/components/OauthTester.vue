<template>
  <button @click="test">Test token</button>
</template>
<script lang="ts" setup>
import {useDruxtClient} from '#imports';
const druxtClient = useDruxtClient();
const test = () => {
  druxtClient.get('/oauth/debug').then((response) => {
    console.log(response.data)
  });
}
</script>
