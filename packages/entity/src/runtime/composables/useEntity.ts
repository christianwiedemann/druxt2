import {useSchema, druxtTheme, useDruxtClient, druxtRender} from "#imports";
import {default as DruxtFieldWrapper} from "../components/DruxtFieldWrapper";
import {default as DruxtEntityWrapper} from "../components/DruxtEntityWrapper";

import {h, resolveComponent} from "vue";
import {useEntityFields} from "./useEntityField";
import {druxtEntityWrapperTheme} from "./druxtEntityWrapperTheme";

export const useEntityWrapperProps = () => {
  return {
    lang: {
      type: String,
      required: true
    },
    druxtComponent: {
      type: Object,
      required: false
    },
    entity: {
      type: Object,
      required: false
    },
    viewMode: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false
    },
    uuid: {
      type: String,
      required: false
    },
  };
}
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

export const useEntity = async (props: { type?, uuid?, entity?, lang, query? }) => {

  if (props.entity) {
    return props.entity
  }
  if (props.uuid && props.type) {
    const client = useDruxtClient();
    const resource = await client.getResource(props.type, props.uuid, props.query ?? {}, props.lang);
    return resource?.data;
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
export const useEntityRender = async (entity, viewMode = 'full', lang = 'en') => {
  if (!entity?.type) {
    return () => h(resolveComponent('DruxtDebug'), {title: 'Unable to render entity', json: entity})
  }
  if (await useEntityIsLayoutBuilderEnabled(entity, viewMode)) {
    const sections = await useEntityLayoutBuilderSections(entity, viewMode);
    return useEntityLayoutBuilderRender(sections, entity, viewMode, lang)
  }
  return useEntityDefaultRender(entity, viewMode, lang)
}


export const useEntityDefaultRender = async (entity, viewMode = 'full', lang = 'en') => {

  const schema = await useEntitySchema(entity, viewMode);
  const fields = useEntityFields(schema, entity, lang);
  // Build scoped slots for each field.
  const scopedSlots = {};
  Object.entries(fields).map(([id, field]) => {
    scopedSlots[id] = [druxtTheme('DruxtFieldWrapper', [[]], {
      lang,
      entity,
      key: id,
      ref: id,
      relationship: field.relationship,
      schema: field.schema,
      value: field.value,
      context: {entity}
    })]
  })
  const options = await useEntityComponentOptions(entity, viewMode);
  const entityComponent = druxtTheme('DruxtEntity', options, {context: {entity, viewMode}}, scopedSlots);
  return () => {
    return druxtRender(entityComponent);
  }
}

export const useEntityLayoutBuilderRender = async (sections, entity, viewMode = 'full', lang = 'en') => {

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
    const layoutId = section.layout_settings?.pattern?.component ?? section.layout_id;
    const pattern = section.layout_settings.pattern;
    const settings = pattern?.settings ?? {};
    const variant = pattern?.variant ?? '';


    const slots = {};
    const drupalComponents: any = section.components;
    const fields = useEntityFields(schema, entity, lang)
    for (const drupalComponent of Object.values(drupalComponents)) {
      // @ts-ignore
      const id = drupalComponent.configuration.id;
      // @ts-ignore
      const slotName = drupalComponent.region;
      if (!slots[slotName]) {
        slots[slotName] = [];
      }

      if (id.startsWith('inline_block')) {
        // @ts-ignore
        const blockRevisionId = drupalComponent.configuration?.block_revision_id;
        // @ts-ignore
        const childViewMode = drupalComponent.configuration?.view_mode;
        const childEntity = {data: includedBlocksByRevisionId[blockRevisionId]};
        const blockTheme = druxtEntityWrapperTheme({lang, viewMode: childViewMode, entity: childEntity});
        slots[slotName].push(blockTheme);
      } else if (id.startsWith('field_block')) {
        const fieldConfig = id.split(':');
        const fieldName = fieldConfig[fieldConfig.length - 1];
        const field = fields[fieldName];
        if (!field) {
          console.error('Unable to find field with name ' + fieldName)
        } else {
          const fieldTheme = druxtTheme('DruxtFieldWrapper', [[]], {
            context: {entity},
            entity,
            lang,
            key: id,
            ref: id,
            relationship: field.relationship,
            schema: field.schema,
            'value': field.value
          }, {}, lang)
          slots[slotName].push(fieldTheme);
        }
      } else if (id.startsWith('views_block')) {
        const viewConfig = id.split(':')[1];
        const [viewId, displayId] = viewConfig.split('-');
        const viewTheme = druxtTheme('DruxtViewWrapper', [[]], {lang, viewId, displayId});
        slots[slotName].push(viewTheme);
      } else {
        const blockConfigIds = id.split(':');
        console.log('CONFIG',drupalComponent);
        const blockTheme = druxtTheme('DruxtBlock', [blockConfigIds], {lang, id, configuration: drupalComponent['configuration'], blockId: blockConfigIds[1], context: {entity},});
        slots[slotName].push(blockTheme);
      }
    }
    const props = {...{variant}, ...settings, context: {entity, viewMode}};
    layoutComponents.push(druxtTheme(layoutId, [['wrapper']], props, slots));
  }
  return () => {
    const renderedComponent = [];
    for (const layoutComponent of layoutComponents) {
      renderedComponent.push(druxtRender(layoutComponent))
    }
    return h('div', {}, renderedComponent);
  }

}
