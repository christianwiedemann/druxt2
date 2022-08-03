import { DruxtSchemaStore } from '../stores/schema'

/**
 * Lazy loads a schema into the Vuex State object.
 *
 * @property {string} type - The JSON:API Resource type..
 * @property {string} mode - The Drupal Display mode.
 * @property {('view'|'form')} schemaType - Drupal display schema type, 'view' or 'form'.
 *
 */
export const useSchema = async (type, mode, schemaType) => {
  const store = DruxtSchemaStore();
  return await store.getSchema({
    resourceType: type,
    mode: mode,
    schemaType: schemaType || 'view'
  });
}
