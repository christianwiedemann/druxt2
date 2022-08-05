<script>
import { DruxtRouterMixin } from 'druxt3-router/mixins'
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import {useComponentOptions} from "../composables/useComponentOptions";

export default {
  mixins: [DruxtRouterMixin],
  async render() {

  },
  async setup (props) {
    const drupalRoute = props.route;
    const client = useDruxtClient();
    const jsonapiUrl = drupalRoute.jsonapi.individual;
    const apiParams = new DrupalJsonApiParams();
    const res = await client.get(`${jsonapiUrl}?${apiParams.getQueryString()}`);
    const entity = res.data;
    const options = await useComponentOptions(entity)
    return () => {
      return render(useComponent('DruxtEntity', options, { entity, viewMode: 'full' }));
    }
  }
}
</script>
