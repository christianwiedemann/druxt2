import { defineNuxtPlugin } from "#imports";
import {useRuntimeConfig} from "#app";
import {default as axios} from 'axios';
import {DruxtRouter} from "../router";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const { baseUrl, options } = runtimeConfig.public
  const clientOptions = { axios, ...options, ...!process?.client ? { proxy: { api: false } } : {} }
  const client = new DruxtRouter(baseUrl, clientOptions)

  return {
    provide: {
      druxtRouter: () => client
    }
  }
})
