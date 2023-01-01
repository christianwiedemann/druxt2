<script lang="ts">
import {useEntityLoadAndRender} from "../composables/useEntity";
import {useEntityFieldFormatterProps} from "../composables/useEntityField";

export default {
  props: useEntityFieldFormatterProps(),
  async setup(props) {
    return useEntityLoadAndRender({type: props.item.type, uuid: props.item.id, lang: props.lang, viewMode:  props.schema.settings.display.view_mode || 'default'});
  }
}
</script>
