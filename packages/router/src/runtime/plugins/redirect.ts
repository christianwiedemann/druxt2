import { useNuxtApp, addRouteMiddleware, defineNuxtPlugin } from '#imports';
import { DruxtRouterStore } from "../stores/router";
export default defineNuxtPlugin(() => {
  const { $druxtRouter } = useNuxtApp()
  addRouteMiddleware('druxt-redirect', async (to) => {
    const store = new DruxtRouterStore();
    const { path } = to
    const { redirect } = await store.get(path, 'en', $druxtRouter());
    if (redirect) {
      return redirect;
    }
  }, { global: true })
})
