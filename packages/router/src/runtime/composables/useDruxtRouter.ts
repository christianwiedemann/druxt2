import { DruxtRouter } from "../router";
import { useRuntimeConfig } from "#app";
let client = null;

export const useDruxtRouter = () => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.baseUrl;
  if (client === null) {
    client = new DruxtRouter(baseUrl, $fetch, {})
  }
  return client
}
