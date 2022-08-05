import { DruxtClient } from '../'
import { useRuntimeConfig } from "#app";
let client = null;

export const useDruxtClient = () => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.baseUrl;
  if (client === null) {
    client = new DruxtClient(baseUrl, {})
  }
  return client
}
