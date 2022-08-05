import { useSchemaByEntity } from "./useSchema";
/**
 * Lazy loads a schema into the Vuex State object.
 *
 * @property {entity} object - The JSON:API Entity.
 * @property {string} viewMode - The Drupal View mode.
 * @property {('view'|'form')} schemaType - Drupal display schema type, 'view' or 'form'.
 *
 */
export const isLayoutBuilderEnabled = async (entity, viewMode = 'full') => {
  const schema = await useSchemaByEntity(entity, viewMode, 'view')
  return schema.layout_builder?.enabled ?? false;
}

export const layoutBuilderSections = async (entity, viewMode = 'full') => {
  const schema = await useSchemaByEntity(entity, viewMode, 'view')
  const sections = entity.data.attributes.layout_builder__layout?.length > 0 && schema.layout_builder.allow_custom ? entity.data.attributes.layout_builder__layout : schema.layout_builder.sections;
  return sections;
}
