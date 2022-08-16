// Generated by Nuxt'
import type { Plugin } from '#app'

type Decorate<T extends Record<string, any>> = { [K in keyof T as K extends string ? `$${K}` : never]: T[K] }

type InjectionType<A extends Plugin> = A extends Plugin<infer T> ? Decorate<T> : unknown

type NuxtAppInjections = 
  InjectionType<typeof import("../auto-imports").default> &
  InjectionType<typeof import("../components.plugin").default> &
  InjectionType<typeof import("../../../../../node_modules/nuxt/dist/head/runtime/lib/vueuse-head.plugin").default> &
  InjectionType<typeof import("../../../../../node_modules/nuxt/dist/head/runtime/plugin").default> &
  InjectionType<typeof import("../../../../../node_modules/nuxt/dist/app/plugins/router").default> &
  InjectionType<typeof import("../dist.plugin.66790ee4").default>

declare module '#app' {
  interface NuxtApp extends NuxtAppInjections { }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends NuxtAppInjections { }
}

export { }
