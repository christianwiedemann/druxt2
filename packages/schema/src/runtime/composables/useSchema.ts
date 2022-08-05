import { DruxtSchemaStore } from '../stores/schema'

/**
 * Lazy loads a schema into the Vuex State object.
 *
 * @property {string} type - The JSON:API Resource type.
 * @property {string} viewMode - The Drupal View mode.
 * @property {('view'|'form')} schemaType - Drupal display schema type, 'view' or 'form'.
 *
 */

export const useSchema = async (type, viewMode = 'full', schemaType = 'view') => {
  const store = DruxtSchemaStore();
  return await store.getSchema({
    resourceType: type,
    viewMode: viewMode || 'full',
    schemaType: schemaType || 'view'
  });
}
