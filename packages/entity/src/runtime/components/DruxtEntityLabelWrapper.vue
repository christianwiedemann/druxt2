<script>
import {
  useEntity,
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

      return () => h('DruxtDebug', {title: 'Entity not found', json: props})
    }
    const component = druxtTheme('DruxtLabel', [[entity.data.type]], {entity, lang: props.lang});
    return () => druxtRender(component)
  }
}
</script>
