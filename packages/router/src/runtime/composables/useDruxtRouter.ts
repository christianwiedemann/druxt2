import {useNuxtApp} from "#app";

export const useDruxtRouterProps = () => {
  return {
    /**
     * The JSON:API resource language code.
     *
     * @type {string}
     */
    lang: {
      type: String,
      default: undefined,
    },

    /**
     * The Decoupled router path.
     *
     * @type {string}
     */
    path: {
      type: String,
      default: undefined,
    },

    /**
     * The Decoupled router object.
     *
     * @type {object}
     */
    route: {
      type: Object,
      required: true
    }
  }
}

export const useDruxtRouter = () => {
  const { $druxtRouter } = useNuxtApp();
  return $druxtRouter();
}
