<template>
  <DruxtEntityWrapper :entity="entity" :viewMode="viewMode" :lang="lang"></DruxtEntityWrapper>
</template>
<script>
import { DruxtRouterMixin } from '@druxt2/router/mixins'
import { DrupalJsonApiParams } from "drupal-jsonapi-params";
import { useDruxtClient, useRuntimeConfig } from "#imports";

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
    const res = await client.get(`${jsonapiUrl}?${apiParams.getQueryString()}`);

    const entity = res.data?.data;
    return {
      entity,
      viewMode: drupalRoute.entity.view_mode ?? 'full',
      lang: 'en'
    }
  }
}
</script>
