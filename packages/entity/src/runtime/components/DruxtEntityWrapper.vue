<script>
import {
  useEntity,
  useEntityRender,
  useEntityWrapperProps
} from "../composables/useEntity";

export default {
  props: useEntityWrapperProps(),
  async setup(props) {
    const entity = await useEntity(props);
    if (!entity) {
      const druxtDebug = resolveComponent('DruxtDebug');
      return () => h(druxtDebug, {title: 'Entity not found', json: props})
    }
    return useEntityRender(entity, props.viewMode);
  }
}
</script>
