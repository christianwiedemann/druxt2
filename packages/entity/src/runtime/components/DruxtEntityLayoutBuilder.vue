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
    const renderedSections = [];
    this.sections.forEach((section) => {
      const pattern = section.layout_settings.pattern;
      if (!pattern) {
        renderedSections.push(h('div', `No pattern defined in layout ${section.layout_id}`))
        return;
      }
      return;
      const {component, settings, variant} = pattern;
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
