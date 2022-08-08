<script>
import {
  useEntityRender
} from "../composables/useEntity";

export default {
  props: {
    lang: {
      type: String,
      required: true
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

  },

  async setup(props) {

    const entity = props.entity;
    const viewMode = props.viewMode;
    let loadedEntity = entity;
    if (!loadedEntity) {
      if (props.uuid && props.type) {
        const client = useDruxtClient();
        loadedEntity = await client.getResource(props.type, props.uuid, {}, props.lang);
      }
    }

    if (!loadedEntity) {
      return () => h('div', {innerHTML: 'Entity not found'})
    }
    return useEntityRender(loadedEntity, viewMode);
  }
}
</script>
