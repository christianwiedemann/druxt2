<template>
  <div>
    <OauthLogin/>
    <br/><br/>
    <OauthTester/>
  </div>
</template>


<script>
import OauthLogin from '../../src/runtime/components/OauthLogin.vue';
import OauthTester from '../../src/runtime/components/OauthTester.vue';

export default {
  components: {
    OauthLogin, OauthTester
  },
}
</script>
