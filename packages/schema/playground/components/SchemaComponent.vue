<template>
  <div>
  <div v-for="field of schema.fields" :key="field.id">
    <strong>{{ field.id }}: {{ field.type }}</strong>
    <br/>
  </div>
  </div>
</template>

<script>

import {useSchema} from "#imports";

export default {
  props: {
    type: {
      type: String,
      required: true
    },
  },
  async setup(props) {
    const schema = await useSchema('node--recipe');
    return {schema};
  }
}

</script>

