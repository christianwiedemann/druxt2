import { defineNuxtPlugin } from '#app'
import { DruxtSchemaStore } from '../stores/schema'

export default defineNuxtPlugin(() => {
  return {
    provide: { DruxtSchemaStore }
  }
});
