import {DruxtRouter} from "../router";
import { useRuntimeConfig } from "#app";
import axios from 'axios';
let client = null;

export const useDruxtRouter = () => {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.baseUrl;
  if (client === null) {
    client = new DruxtRouter(baseUrl, {axios})
  }
  return client
}
