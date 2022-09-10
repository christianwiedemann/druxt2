<script>
import {
  useEntity,
  useEntityRender
} from "../composables/useEntity";

export default {
  props: {
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

  },

  async setup(props) {
    const entity = await useEntity(props);
    if (!entity) {
      return () => h('div', {innerHTML: 'Entity not found'})
    }
    return useEntityRender(entity, props.viewMode);
  }
}
</script>
