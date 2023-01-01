<script>
import {
  useEntityLoadAndRender,
  useEntityWrapperProps
} from "../composables/useEntity";

export default {
  props: useEntityWrapperProps(),
  async setup(props) {
    return useEntityLoadAndRender(props);
  }
}
</script>
