<template>
  <DruxtEntityWrapper :entity="entity" :viewMode="viewMode" :lang="lang"></DruxtEntityWrapper>
</template>
<script setup>
import {DrupalJsonApiParams} from "drupal-jsonapi-params";
import {useDruxtRouterProps, useDruxtClient, useRuntimeConfig} from "#imports";
const props = defineProps(useDruxtRouterProps())
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
const viewMode = drupalRoute.entity.view_mode ?? 'full'
const lang = props.lang || 'en';
</script>
