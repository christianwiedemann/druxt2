<template>
  <button @click="login">Login</button>
</template>
<script lang="ts">

export default {
  name: 'OauthLogin',
  methods: {
    login() {
      const app = useNuxtApp();
      app.$http.onRequest((config) => {
        console.log(config)
      });
      app.$http.interceptors.request.use((config) => {
        console.log(config)
      })
      app.$auth.reset();
      app.$auth.loginWith('drupal').then((data) => {
        console.log(data)
      })
    }
  }
}

</script>
