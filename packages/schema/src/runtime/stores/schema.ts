import { defineStore } from 'pinia'
import { useNuxtApp } from "#app";

const DruxtSchemaStore = defineStore({
  id: 'druxt-schema-store',

  state: () => ({
    schemas: {},
  }),
  /**
   * Actions.
   */
  actions: {
    addSchema( id, schema ) {
      this.schemas[id] = schema
    },
    async getSchema(resource) {
      resource = {
        id: null,
        resourceType: null,
        entityType: 'node',
        bundle: null,
        mode: 'default',
        schemaType: 'view',

        ...resource
      }
      // Build ID from resource type.
      if (!resource.id && resource.resourceType) {
        resource.id = [resource.resourceType, resource.mode, resource.schemaType].join('--')
      }

      // Build ID from entity and bundle types.
      if (!resource.id && resource.bundle) {
        resource.id = [resource.entityType, resource.bundle, resource.mode, resource.schemaType].join('--')
      }
      if (!resource.id) {
        return false
      }

      // Only load if we don't have this schema in the store.
      if (!this.schemas[resource.id]) {
        const { $importSchema } = useNuxtApp();
        const schema = await $importSchema(resource.id)
        this.addSchema(resource.id, schema);
      }
      return this.schemas[resource.id]
    }
  }
});

export { DruxtSchemaStore }
