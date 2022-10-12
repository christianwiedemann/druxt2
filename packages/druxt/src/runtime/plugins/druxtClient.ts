import { defineNuxtPlugin } from "#imports";
import {useRuntimeConfig} from "#app";
import { default as axios } from 'axios';
import { DruxtClient } from '@druxt2/core'

export default defineNuxtPlugin(() => {

  const runtimeConfig = useRuntimeConfig()
  const { baseUrl, options } = runtimeConfig.public
  const clientOptions = { axios, ...options, ...!process?.client ? { proxy: { api: false } } : {} }
  const client = new DruxtClient(baseUrl, clientOptions)

  return {
    provide: {
      druxtClient: () => client
    }
  }
})
