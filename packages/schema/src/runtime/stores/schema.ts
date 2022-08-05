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
        viewMode: 'default',
        schemaType: 'view',

        ...resource
      }
      // Build ID from resource type.
      if (!resource.id && resource.resourceType) {
        resource.id = [resource.resourceType, resource.viewMode, resource.schemaType].join('--')
      }

      // Build ID from entity and bundle types.
      if (!resource.id && resource.bundle) {
        resource.id = [resource.entityType, resource.bundle, resource.viewMode, resource.schemaType].join('--')
      }
      if (!resource.id) {
        return false
      }
      const importSchema = async id => {

        const result = await import(`../../schemas/${id}.json`)
          .then(m => m.default || m)
          .catch(async (err) => {

            const parts = id.split('--')
            // Error if there's no default view mode.
            if (parts[parts.length - 2] === 'default') throw err
            // Fallback to the default view mode.
            parts[parts.length - 2] = 'default'
            return import(`../../schemas/${parts.join('--')}.json`).then(m => m.default || m)
          });
        return result;
      }
      // Only load if we don't have this schema in the store.
      if (!this.schemas[resource.id]) {
        const schema = await importSchema(resource.id)
        this.addSchema(resource.id, schema);
      }
      return this.schemas[resource.id]
    }
  }
});

export { DruxtSchemaStore }
