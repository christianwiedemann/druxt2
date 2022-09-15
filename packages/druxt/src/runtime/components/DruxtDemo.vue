<script lang="ts">
import { druxtTheme, druxtRender, useDruxtClient } from '#imports';
export default {
  setup() {
    const client = useDruxtClient()
    // use an array to return multiple root nodes
    return () => druxtRender(
      druxtTheme('DruxtDemoComponent', [[]], {},{ 'content': [druxtTheme('DruxtDemoComponent')]})
    )
  }
}

</script>
