<script lang="ts">
import {useEntity, useEntityRender} from "../composables/useEntity";
import {useEntityFieldFormatterProps} from "../composables/useEntityField";

export default {
  props: useEntityFieldFormatterProps(),
  async setup(props) {
    const entity = await useEntity({type: props.item.type, uuid: props.item.id, lang: props.lang});
    return useEntityRender(entity, props.schema.settings.display.view_mode || 'default');
  }
}
</script>
