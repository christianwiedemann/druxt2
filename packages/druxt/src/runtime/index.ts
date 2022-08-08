/**
 * The JSON:API client used by the Druxt Nuxt plugin and DruxtStore.
 *
 * @type {class}
 * @exports DrupalClient
 * @name DruxtClient
 * @see {@link /api/packages/druxt/client|DruxtClient}
 *
 * @example <caption>Creating a new instance of the DrupalClient</caption> @lang js
 * import { DrupalClient } from 'eep'
 * const eep = new DrupalClient('https://demo-api.druxtjs.org')
 */
export { DruxtClient } from './client'

export type Component = {
  suggestions: string[];
  props?: {};
  slots?: any;
  is: () => string
}
