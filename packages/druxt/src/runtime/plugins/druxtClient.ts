import { defineNuxtPlugin } from "#imports";
import {useRuntimeConfig} from "#app";
import { default as axios } from 'axios';
import { DruxtClient } from '@druxt2/core'

export default defineNuxtPlugin(() => {

  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.baseUrl;
  const client = new DruxtClient(baseUrl, {axios});

  return {
    provide: {
      druxtClient: () => client
    }
  }
})
