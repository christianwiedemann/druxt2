<template>
  <DruxtEntityWrapper :entity="entity" :viewMode="viewMode" :lang="lang"></DruxtEntityWrapper>
</template>
<script setup>
import {useDruxtRouterProps, useDruxtClient, useRuntimeConfig} from "#imports";
import {useEntity} from "../composables/useEntity";
const props = defineProps(useDruxtRouterProps())
const config = useRuntimeConfig();
const query = config.public.options.query;
const drupalRoute = props.route;
const client = useDruxtClient();
console.log('drupalRoute', drupalRoute)
const type = `${drupalRoute.entity.type}--${drupalRoute.entity.bundle}`;
const lang = props.lang || 'en';
const entity = useEntity({type, uuid: drupalRoute.entity.uuid, query: query[type] ?? {}, lang});
const viewMode = drupalRoute.entity.view_mode ?? 'full'

</script>
