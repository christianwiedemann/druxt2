import { NuxtModule } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface NuxtConfig {
    ["druxt"]?: typeof import("druxt3").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["druxt"]?: typeof import("druxt3-schema").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["druxt"]?: typeof import("druxt3-router").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["druxt"]?: typeof import("druxt3-entity").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["druxt"]?: typeof import("druxt-entity").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
  }
  interface RuntimeConfig {
     app: {
        baseURL: string,

        buildAssetsDir: string,

        cdnURL: string,
    },
  }
  interface PublicRuntimeConfig {
     baseUrl: string,

    endpoint: string,

    options: {
        proxy: {
             api: boolean,

             files: string,
        },

        baseUrl: string,

        endpoint: string,

        query: {
             "node--landingpage": {
                   includes: Array<string>,
             },

             "node--recipe": {
                   includes: Array<string>,
             },
        },
    },
  }
}