import {addRouteMiddleware, defineNuxtPlugin, useDruxtRouter, useDruxtClient, useNuxtApp} from '#imports';

export default defineNuxtPlugin(() => {
    addRouteMiddleware('global-authorize', async (to) => {
        const druxt = useDruxtClient();
        const router = useDruxtRouter()
        const app = useNuxtApp();

        if (to.query.tokenOverride) {
            app.$auth.setUserToken(to.query.tokenOverride);
        }

        if (app.$auth.$state.loggedIn) {
            const {tokenExpired, refreshTokenExpired, isRefreshable} = app.$auth.check(true);
            if (refreshTokenExpired) {
                app.$auth.reset();
            } else if (tokenExpired) {
                if (isRefreshable) {
                    try {
                        await app.$auth.refreshTokens();
                    } catch (error) {
                        app.$auth.reset();
                    }
                } else {
                    app.$auth.reset();
                }
            }
        }

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
