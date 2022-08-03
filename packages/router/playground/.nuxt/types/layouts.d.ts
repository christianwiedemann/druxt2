import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "default"
declare module "/home/cw/projects/eep/druxt3.js/packages/router/playground/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}