import { useNuxtApp, useRoute, addRouteMiddleware, defineNuxtPlugin } from '#imports';
import { DruxtRouterStore } from "../stores/router";
export default defineNuxtPlugin(() => {
  const { $druxtRouter } = useNuxtApp()
  addRouteMiddleware('global-test', async (to) => {
    const store = new DruxtRouterStore();
    const { path } = to
    const { redirect } = await store.get(path, $druxtRouter());
    if (redirect) {
      return redirect;
    }

  }, { global: true })
})
