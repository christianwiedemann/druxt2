import { defineNuxtPlugin } from "#imports";
import {useRuntimeConfig} from "#app";
import * as axios from 'axios';
import {DruxtRouter} from "../router";

export default defineNuxtPlugin(() => {

  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.baseUrl;
  const client = new DruxtRouter(baseUrl, {axios})

  return {
    provide: {
      druxtRouter: () => client
    }
  }
})
