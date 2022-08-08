<script lang="ts">
import { useComponent, render } from '#imports';
export default {
  setup() {
    // use an array to return multiple root nodes
    return () => render(
      useComponent('DruxtDemoComponent', [[]], {},{ 'content': [useComponent('DruxtDemoComponent')]})
    )
  }
}

</script>
