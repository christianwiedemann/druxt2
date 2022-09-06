<template>
  <div>
    <OauthLogin/>
    <br><br>
    <button @click="testLoggedIn">Test token</button>
    <br><br>
    User id: {{ user_id }}<br>
    Roles: {{ roles }}
  </div>
</template>


<script>
import OauthLogin from '../../src/runtime/components/OauthLogin.vue';

export default {
  components: {
    OauthLogin
  },
  data() {
    return {
      user_id: '',
      roles: '',
    };
  },
  methods: {
    testLoggedIn() {
      const app = useNuxtApp()
      app.$auth.refreshTokens();
      const token = app.$auth.strategy.token.get();


      $fetch('http://oidconnect.docksal/oauth/debug', {
        headers: {
          'Authorization': token
        }
      }).then((response) => {
        this.user_id = response.id;
        this.roles = response.roles;
      });
    }
  }
}
</script>
