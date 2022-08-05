import { useSchema } from "#imports";
/**
 * Lazy loads a schema into the Vuex State object.
 *
 * @property {entity} object - The JSON:API Entity.
 * @property {string} viewMode - The Drupal View mode.
 * @property {('view'|'form')} schemaType - Drupal display schema type, 'view' or 'form'.
 *
 */
export const useSchemaByEntity = async (entity, viewMode = 'full', schemaType = 'view') => {
  return useSchema(entity.data.type, viewMode, schemaType);
}

