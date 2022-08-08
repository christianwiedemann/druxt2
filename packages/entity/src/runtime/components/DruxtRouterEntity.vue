<template>
  <DruxtEntityWrapper :entity="entity" viewMode="full" :lang="lang"></DruxtEntityWrapper>
</template>
<script>
import { DruxtRouterMixin } from 'druxt3-router/mixins'
import { DrupalJsonApiParams } from "drupal-jsonapi-params";

export default {
  mixins: [DruxtRouterMixin],
  async setup (props) {

    const config = useRuntimeConfig();
    const query = config.public.options.query;

    const drupalRoute = props.route;
    const client = useDruxtClient();
    const jsonapiUrl = drupalRoute.jsonapi.individual;
    const id = `${drupalRoute.entity.type}--${drupalRoute.entity.bundle}`;

    const apiParams = new DrupalJsonApiParams();
    if (query[id]) {
      apiParams.addInclude(query[id].includes);
    }
    console.log(`${jsonapiUrl}?${apiParams.getQueryString()}`);
    const res = await client.get(`${jsonapiUrl}?${apiParams.getQueryString()}`);

    const entity = res.data;
    return {
      entity,
      lang: 'en'
    }
  }
}
</script>
