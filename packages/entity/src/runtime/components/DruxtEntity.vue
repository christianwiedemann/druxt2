<script>
import {h, resolveDynamicComponent} from 'vue'
import {resolveComponent} from 'vue';

export default {
  props: {
    entity: {
      type: Object,
      required: true
    },
    viewMode: {
      type: String,
      required: true
    }
  },

  render() {
    const isComponent = name => typeof resolveDynamicComponent(name) !== 'string'

    function suggestionResolve(suggestions = []) {

      let foundComponentName = null;
      suggestions.forEach((name) => {
        if (isComponent(name)) {
          foundComponentName = name;
          return;
        }
      });
      return foundComponentName;
    }

    function suggestString(string) {
      return typeof string === 'string'
        ? string.replace(/((\b|[^a-zA-Z0-9]+)[a-zA-Z0-9])/gi, (match, p1, p2) => match.toUpperCase().replace(p2, ''))
        : false
    }

    // Has layout
    if (!this.sections) {
      const suggestionNames = []
      this.componentOptions.forEach((names) => {
        let suggestionName = '';
        names.forEach((name) => {
          suggestionName += suggestString(name);
        });
        suggestionNames.push(suggestionName);
      });
      const resolvedComponentName = suggestionResolve(suggestionNames, {viewMode: this.viewMode, entity: this.entity});
      if (resolvedComponentName) {
        return h(resolveComponent(resolvedComponentName), {entity: this.entity, viewMode: this.viewMode});
      }
      return h(resolveComponent('DrupalDebug'),{json: this.entity, 'title': 'No Layout Builder definition found. Fallback to Entity suggestions with no luck: ' + JSON.stringify(suggestionNames, null, '  ')} );
    }

    const renderedSections = [];
    this.sections.forEach((section) => {
      const pattern = section.layout_settings.pattern;
      if (!pattern) {
        renderedSections.push(h('div', `No pattern defined in layout ${section.layout_id}`))
        return;
      }
      const {component, settings, variant} = pattern;
      if (!component || !isComponent(component)) {
        renderedSections.push(h(resolveComponent('DrupalDebug'), {title: `Unable to resolve pattern ${component}`, json: this.schema}))
        return;
      }
      const componentImpl = resolveComponent(component);
      settings['paddingBottom'] = 'default';
      const props = {...{variant}, ...settings};
      const slots = {};
      const drupalComponents = section.components;
      Object.values(drupalComponents).forEach((drupalComponent) => {
        const id = drupalComponent.configuration.id;
        const slotName = drupalComponent.region;
        slots[slotName] = slots[slotName] ?? [];
        if (id.startsWith('inline_block')) {
          const blockRevisionId = drupalComponent.configuration.block_revision_id;
          const childViewMode = drupalComponent.configuration.view_mode;
          const childEntity = {data: this.includedBlocksByRevisionId[blockRevisionId]};
          const resolvedEntity = resolveComponent('DrupalEntity');
          slots[slotName].push(h(resolvedEntity, {viewMode: childViewMode, entity: childEntity}));
        } else if (id.startsWith('field_block')) {
          const resolvedEntity = resolveComponent('DrupalField');
          const fieldConfig = id.split(':');
          const fieldName = fieldConfig[fieldConfig.length - 1];
          const field = this.entity.data.attributes[fieldName];
          slots[slotName].push(h(resolvedEntity, {field, entity: this.entity})) ;
        }
      })
      const renderedSlots = {};
      Object.keys(slots).forEach(slotName=>{
        renderedSlots[slotName] = () => slots[slotName];
      })
      renderedSections.push(h(componentImpl, props, renderedSlots));

    });

    return h('div',
      renderedSections
    );

  },
  async setup(props) {

    const type = props.entity.data.type;
    const viewMode = props.viewMode;
    const schema = await useSchema(type, viewMode);

    const {entity} = props;
    const sections = entity.data.attributes.layout_builder__layout?.length > 0 && schema.layout_builder.allow_custom ? entity.data.attributes.layout_builder__layout : schema.layout_builder.sections;
    const included = entity.included ?? [];
    const includedBlocksByRevisionId = {};
    included.forEach((includedEntity) => {
      if (includedEntity.type.startsWith('block_content')) {
        includedBlocksByRevisionId[includedEntity.attributes.drupal_internal__revision_id] = includedEntity;
      }
    });

    /**
     * Provides the available component naming options for the Druxt Wrapper.
     *
     * @param {object} context - The module component ViewModel.
     * @returns {ComponentOptions}
     */
    function componentOptions({mode, schema, schemaType, type}) {
      return [
        // DruxtEntity[ResourceType][ViewMode][SchemaType]
        [
          (schema || {}).resourceType || type,
          ((schema || {}).config || {}).mode || mode,
          ((schema || {}).config || {}).schemaType || schemaType || 'view'
        ],
        // DruxtEntity[EntityType][ViewMode][SchemaType]
        [
          (((schema || {}).resourceType || type) || '').split('--').shift(),
          ((schema || {}).config || {}).mode || mode,
          ((schema || {}).config || {}).schemaType || schemaType || 'view'
        ],
        // DruxtEntity[ViewMode]
        [
          ((schema || {}).config || {}).mode || mode,
        ],
      ];
    }

    return {
      includedBlocksByRevisionId,
      included,
      sections,
      schema,
      componentOptions: componentOptions({viewMode, schema})
    }
  }
}
</script>
