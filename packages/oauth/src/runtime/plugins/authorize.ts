import {addRouteMiddleware, defineNuxtPlugin, useDruxtRouter, useDruxtClient, useNuxtApp} from '#imports';

export default defineNuxtPlugin(() => {
    addRouteMiddleware('global-authorize', async (to) => {
        const druxt = useDruxtClient();
        const router = useDruxtRouter()
        const app = useNuxtApp();

        if (to.query.tokenOverride) {
            console.log('Set user token.: ', to.query.tokenOverride)
            app.$auth.setUserToken(to.query.tokenOverride);
        }

        if (app.$auth.$state.loggedIn) {
            console.log('Is logged in')
            console.log('CHECK FOR EXPIRED TOKEN')
            const {tokenExpired, refreshTokenExpired, isRefreshable} = app.$auth.check(true);
            console.log(tokenExpired)
            console.log(refreshTokenExpired)
            console.log(isRefreshable)
            if (refreshTokenExpired) {
                app.$auth.reset();
                console.log('REFRESH TOKEN EXPIRED')
            } else if (tokenExpired) {
                if (isRefreshable) {
                    try {
                        console.log('REFRESH TOKEN')
                        await app.$auth.refreshTokens();
                    } catch (error) {
                        console.log('ERROR ' + error)
                        app.$auth.reset();
                    }
                } else {
                    console.log('NOT REFRESHABLE')
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
            console.log('NOT LOGGED IN')
        }


    }, {global: true})
})
