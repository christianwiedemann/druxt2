import {addRouteMiddleware, defineNuxtPlugin, useDruxtRouter, useDruxtClient, useNuxtApp} from '#imports';

export default defineNuxtPlugin(() => {
    addRouteMiddleware('global-authorize', async (to) => {
        const druxt = useDruxtClient();
        const router = useDruxtRouter()
        const app = useNuxtApp();

        if (to.query.tokenOverride !== undefined) {
            if (to.query.tokenOverride === '') {
                // Preview Logout
                app.$auth.setUserToken('');
                app.$auth.$state.loggedIn = false;
            } else {
                // Preview Login
                app.$auth.setUserToken(to.query.tokenOverride);
                app.$auth.$state.loggedIn = true;
            }
        }
        if (app.$auth.$state.loggedIn)
            console.info('Druxt: Logged in')
            const {tokenExpired, refreshTokenExpired, isRefreshable} = app.$auth.check(true);
            if (refreshTokenExpired) {
                app.$auth.reset();
            } else if (tokenExpired) {
                if (isRefreshable) {
                    try {
                        await app.$auth.refreshTokens();
                    } catch (error) {
                        console.error(error)
                        app.$auth.reset();
                    }
                } else {
                    app.$auth.reset();
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
        } else {
            console.info('Druxt: Not logged in')
        }


    }, {global: true})
})
