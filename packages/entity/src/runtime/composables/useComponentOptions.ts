import { useSchemaByEntity } from "./useSchema";
import { isLayoutBuilderEnabled } from "./useLayoutBuilder";
/**
 * Provides the available component naming options for the Druxt Wrapper.
 *
 * @param {object} context - The module component ViewModel.
 * @returns {ComponentOptions}
 */
export const useComponentOptions = async (entity, viewMode = 'full', schemaType = 'view') => {
  const schema = await useSchemaByEntity(entity, viewMode, schemaType);
  const layoutBuilderOption = await isLayoutBuilderEnabled(entity, viewMode) ? 'LayoutBuilder' : 'Default';
  const type = entity.data.type;
  return [
    // DruxtEntity[ResourceType][ViewMode][SchemaType]
    [

      (schema || {}).resourceType || entity,
      layoutBuilderOption,
      ((schema || {}).config || {}).mode || viewMode,
      ((schema || {}).config || {}).schemaType || schemaType || 'view' ,

    ],
    // DruxtEntity[EntityType][ViewMode][SchemaType]
    [
      (((schema || {}).resourceType || type) || '').split('--').shift(),
      layoutBuilderOption,
      ((schema || {}).config || {}).mode || viewMode,
      ((schema || {}).config || {}).schemaType || schemaType || 'view',

    ],
    // DruxtEntity[ViewMode]
    [
      layoutBuilderOption,
      ((schema || {}).config || {}).mode || viewMode,
    ],
  ];

}
