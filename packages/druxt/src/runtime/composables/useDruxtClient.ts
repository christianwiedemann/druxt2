import { useRuntimeConfig } from "#app";
import { DruxtClient } from '@druxt2/core'
let client = null;

export const useDruxtClient = () => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.baseUrl;
  if (client === null) {
    client = new DruxtClient(baseUrl, $fetch, {})
  }
  return client
}
