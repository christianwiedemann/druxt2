import {useSchema, useComponent, useDruxtClient, render} from "#imports";
import {h, resolveComponent} from "vue";
import {useEntityFields} from "./useEntityField";

/**
 * Lazy loads a schema into the Vuex State object.
 *
 * @property {entity} object - The JSON:API Entity.
 * @property {string} viewMode - The Drupal View mode.
 * @property {('view'|'form')} schemaType - Drupal display schema type, 'view' or 'form'.
 *
 */
export const useEntitySchema = async (entity, viewMode = 'full', schemaType = 'view') => {
  return useSchema(entity.type, viewMode, schemaType);
}

/**
 * Lazy loads a schema into the Vuex State object.
 *
 * @property {entity} object - The JSON:API Entity.
 * @property {string} viewMode - The Drupal View mode.
 * @property {('view'|'form')} schemaType - Drupal display schema type, 'view' or 'form'.
 *
 */
export const useEntityIsLayoutBuilderEnabled = async (entity, viewMode = 'full') => {
  const schema = await useEntitySchema(entity, viewMode, 'view')
  return schema.layout_builder?.enabled ?? false;
}

export const useEntityLayoutBuilderSections = async (entity, viewMode = 'full') => {
  const schema = await useEntitySchema(entity, viewMode, 'view')
  const sections = entity.attributes.layout_builder__layout?.length > 0 && schema.layout_builder.allow_custom ? entity.attributes.layout_builder__layout : schema.layout_builder.sections;
  return sections;
}

export const useEntity = async ( props: {type?, uuid?, entity?, lang} ) => {
  if (props.entity) {
    return props.entity
  }
  if (props.uuid && props.type) {
    const client = useDruxtClient();
    return await client.getResource(props.type, props.uuid, {}, props.lang)?.data;
  }
}

/**
 * Provides the available component naming options for the Druxt Wrapper.
 *
 * @param {object} context - The module component ViewModel.
 * @returns {ComponentOptions}
 */
export const useEntityComponentOptions = async (entity, viewMode = 'full', schemaType = 'view') => {
  const schema = await useEntitySchema(entity, viewMode, schemaType);
  const layoutBuilderOption = await useEntityIsLayoutBuilderEnabled(entity, viewMode) ? 'LayoutBuilder' : 'Default';
  const type = entity.type;
  return [
    // DruxtEntity[ResourceType][ViewMode][SchemaType]
    [

      (schema || {}).resourceType || entity,
      layoutBuilderOption,
      ((schema || {}).config || {}).mode || viewMode,
      ((schema || {}).config || {}).schemaType || schemaType || 'view',

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
export const useEntityRender = async (entity, viewMode = 'full', lang ='en') => {
  if (!entity?.type) {
    return () => h(resolveComponent('DruxtDebug'), {title: 'Unable to render entity', json: entity})
  }
  if (await useEntityIsLayoutBuilderEnabled(entity, viewMode)) {
    return useEntityLayoutBuilderRender(entity, viewMode, lang)
  }
  return useEntityDefaultRender(entity, viewMode, lang)
}

export const useEntityDefaultRender = async (entity, viewMode = 'full', lang = 'en') => {

  const schema = await useEntitySchema(entity, viewMode);
  const fields = useEntityFields(schema, entity, lang);
  // Build scoped slots for each field.
  const scopedSlots = {};
  Object.entries(fields).map(([id, field]) => {
    scopedSlots[id] = [useComponent('DruxtFieldWrapper', [[]],  {key: id, ref: id, relationship: field.relationship, schema: field.schema, 'model': field.value})]
  })
  const options = await useEntityComponentOptions(entity, viewMode);
  const entityComponent = useComponent('DruxtEntity', options, {entity, viewMode, lang}, scopedSlots);
  return () => {
    return render(entityComponent);
  }
}

export const useEntityLayoutBuilderRender = async (entity, viewMode = 'full', lang = 'en') => {
  const sections = await useEntityLayoutBuilderSections(entity, viewMode);
  const included = entity.included ?? [];
  const includedBlocksByRevisionId = {};
  const schema = await useEntitySchema(entity);
  included.forEach((includedEntity) => {
    if (includedEntity.type.startsWith('block_content')) {
      includedBlocksByRevisionId[includedEntity.attributes.drupal_internal__revision_id] = includedEntity;
    }
  });

  const layoutComponents = [];
  for (const section of sections) {
    const layoutId = section.layout_settings.pattern ?? section.layout_id;
    const pattern = section.layout_settings.pattern;
    const settings = pattern?.settings ?? {};
    const variant = pattern?.variant ?? '';

    const props = {...{variant}, ...settings};
    const slots = {};
    const drupalComponents:any = section.components;
    const fields = useEntityFields(schema, entity, lang)
    for (const drupalComponent of Object.values(drupalComponents)) {
      const id = drupalComponent.configuration.id;
      const slotName = drupalComponent.region;
      if (!slots[slotName]) {
        slots[slotName] = [];
      }
      if (id.startsWith('inline_block')) {
        const blockRevisionId = drupalComponent.configuration?.block_revision_id;
        const childViewMode = drupalComponent.configuration?.view_mode;
        const childEntity = {data: includedBlocksByRevisionId[blockRevisionId]};
        const blockComponent = useComponent('DruxtEntityWrapper', [[]], {lang, viewMode: childViewMode, entity: childEntity});
        slots[slotName].push(blockComponent);
      } else if (id.startsWith('field_block')) {
        const fieldConfig = id.split(':');
        const fieldName = fieldConfig[fieldConfig.length - 1];
        const field = fields[fieldName];
        if (!field) {
          //slots[slotName].push(useComponent('DruxtDebug', [[]], {title: 'Unable to find field with name: ' + fieldName}));
          console.error('Unable to find field with name ' + fieldName)
        } else {
          const fieldComponent = useComponent('DruxtFieldWrapper', [[]],  {lang, key: id, ref: id, relationship: field.relationship, schema: field.schema, 'model': field.value})
          slots[slotName].push(fieldComponent);
        }
      }
    }
    layoutComponents.push(useComponent('DruxtSection', [['layout']], props, slots));
  }
  return () => {
    const renderedComponent = [];
    for (const layoutComponent of layoutComponents) {
      renderedComponent.push(render(layoutComponent))
    }
    return h('div', {}, renderedComponent);
  }

}
