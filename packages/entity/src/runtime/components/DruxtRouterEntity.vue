<script>
import {useDruxtRouterProps, useRuntimeConfig, druxtRender} from "#imports";
import { druxtEntityWrapperTheme } from "../composables/druxtEntityWrapperTheme";

export default {
  props: useDruxtRouterProps(),
  async setup(props) {
    const config = useRuntimeConfig();
    const query = config.public.options.query;
    const drupalRoute = props.route;
    const type = `${drupalRoute.entity.type}--${drupalRoute.entity.bundle}`;
    const lang = props.lang || 'en';
    const wrapper = await druxtEntityWrapperTheme({viewMode: 'full', type, uuid: drupalRoute.entity.uuid, query: query[type] ?? {}, lang})
    return () => druxtRender(wrapper);
  }
}

</script>
