import {addRouteMiddleware, defineNuxtPlugin, useDruxtRouter, useDruxtClient, useNuxtApp} from '#imports';

export default defineNuxtPlugin(() => {
    addRouteMiddleware('global-authorize', async (to) => {
        const druxt = useDruxtClient();
        const router = useDruxtRouter()
        const app = useNuxtApp();
        const token = app.$auth.strategy.token.get();

        if (typeof token != 'undefined') {
            druxt.addHeaders({
                'Authorization': token
            });
            router.getDruxtClient().addHeaders({
                'Authorization': token
            });
        }
    }, {global: true})
})
