<script>

import { DruxtRouterStore } from "../stores/router";
import { druxtTheme, druxtRender, useRoute } from "#imports";

/**
 * The DruxtRouter component renders a Drupal decoupled route, or path, using
 * the appropriate Druxt component.
 *
 * For instance, using the path `/node/1` would render a DruxtEntity component.
 *
 * The Vue router path will be used if not path is defined.
 *
 * @example <caption>Render using the Vue router path</caption> @lang vue
 * <DruxtRouter />
 *
 * @example <caption>Render a specified path</caption> @lang vue
 * <DruxtRouter path="/node/1" />
 *
 * @example <caption>Render the result of the model, bypasses Drupal backend</caption> @lang vue
 * <DruxtRouter v-model="route" />
 *
 * @example <caption>DruxtRouter Wrapper component boilerplate</caption> @lang vue
 * <template>
 *   <DruxtDebug :json="route" />
 * </template>
 *
 * <script>
 * import { DruxtRouterMixin } from 'druxt-router'
 * export default {
 *   mixins: [DruxtRouterMixin]
 * }
 *
 * @example <caption>DruxtRouter with template injection</caption> @lang vue
 * <DruxtRouter>
 *   <template #default="{ route }">
 *     <!-- Do whatever you want here -->
 *     <DruxtDebug :json="route" open />
 *   </template>
 * </DruxtRouter>
 */
export default {
  name: 'DruxtRouter',

  /** */
  props: {
    /**
     * The Decoupled router path.
     *
     * If not set, the Nuxt router value will be used instead.
     *
     * @type {string}
     *
     * @example @lang vue
     * <DruxtRouter path="/node/1" />
     */
    path: {
      type: String,
      default: undefined,
    },

    /**
     * The JSON:API resource language code.
     *
     * @type {string}
     */
    lang: {
      type: String,
      default: undefined,
    },

  },

  /**
   * Nuxt head method.
   *
   * - Sets the page title.
   * - Sets the canonical link.
   *
   * @todo Improve metatag support.
   */
  head() {
    const head = {
      title: this.title,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.canonical || (this.route || {}).canonical
        }
      ]
    }

    if (this.metatags) {
      head.meta = this.metatags
    }

    return head
  },

  async setup(props) {

    const nuxtRoute = useRoute();
    const store = new DruxtRouterStore();

    // Get the route from the Drupal decoupled router module via the
    // druxtRouter store.
    // Use the Path prop or the Vue Router as the route to lookup.
    const path = props.path || nuxtRoute.path || nuxtRoute.fullPath

    const route = await store.getRoute(path, props.lang);
    // If this the path is the active Vue route, set the active route in the
    // druxtRouter store for other modules to use.
    // This is also done when via the middleware if in use.
    const setActiveRoute = path === nuxtRoute.fullPath
    if (setActiveRoute) {
      store.setRoute(path);
    }
    const module = route.type;
    const lang = props.lang

    return () => {
      return druxtRender(druxtTheme('DruxtRouter',[[
        module || 'error',
        route.isHomePath ? 'front' : 'not-front',
        'default',
      ],['debug']], {lang, route, path: nuxtRoute.path }));
    }
  },
}

/**
 * Provides the available naming options for the Wrapper component.
 *
 * @typedef {array[]} ComponentOptions
 *
 * @example @lang js
 * [
 *   'DruxtRouter[Module][IsFront?][Langcode]',
 *   'DruxtRouter[Module][IsFront?]',
 *   'DruxtRouter[Module][Langcode]',
 *   'DruxtRouter[Module]',
 *   'DruxtRouter[Default][Langcode]',
 *   'DruxtRouter[Default]',
 * ]
 *
 * @example <caption>Entity route</caption> @lang js
 * [
 *   'DruxtRouterEntityFrontEn',
 *   'DruxtRouterEntityFront',
 *   'DruxtRouterEntityEn',
 *   'DruxtRouterEntity',
 *   'DruxtRouterDefaultEn',
 *   'DruxtRouterDefault'
 * ]
 */

/**
 * Provides property data for use in the Wrapper component.
 *
 * @typedef {object} PropsData
 * @param {string} path - The route path.
 * @param {object} route - The Decoupled Router object.
 *
 * @example @lang js
 * {
 *   path: '/',
 *   route: {
 *     canonical: 'https://demo-api.druxtjs.org/en/node',
 *     component: 'druxt-view',
 *     error: false,
 *     isHomePath: true,
 *     jsonapi: {},
 *     label: 'Home',
 *     props: {},
 *     redirect: false,
 *     resolvedPath: '/en/node',
 *     type: 'views',
 *   }
 * }
 */

/**
 * Provides scoped slots for use in the Wrapper component.
 *
 * @typedef {object} ScopedSlots
 * @param {function} debug - A Debug component with a Path override field.
 * @param {function} default - Default error handling.
 *
 * @example <caption>DruxtRouter**Module**.vue</caption> @lang vue
 * <template>
 *   <div>
 *     <slot name="debug" />
 *     {{ route.props }}
 *   </div>
 * </template>
 */
</script>
