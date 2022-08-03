<script>
import { DruxtRouterMixin } from 'druxt3-router/mixins'
import {DrupalJsonApiParams} from "drupal-jsonapi-params";

export default {
  mixins: [DruxtRouterMixin],
  async setup (props) {
    const drupalRoute = props.route;
    const baseUrl = 'http://eep-develop.docksal'
    const client = useDruxtClient(baseUrl);
    const jsonapiUrl = drupalRoute.jsonapi.individual;
    const apiParams = new DrupalJsonApiParams();
    const res = await client.get(`${jsonapiUrl}?${apiParams.getQueryString()}`);
    const entity = res.data;
    return () => {
      return render(useComponent([`DruxtEntity`], { entity, viewMode: 'full' }));
    }
  }
}
</script>
