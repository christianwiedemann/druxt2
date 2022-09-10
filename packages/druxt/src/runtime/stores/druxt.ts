import merge from 'deepmerge'
import md5 from 'md5'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {defineStore} from "pinia";
import {useDruxtClient} from "#imports";

const getDrupalJsonApiParams = (query) => {
  return new DrupalJsonApiParams().initialize(query);
}

const dehydrateResources = ({store, queryObject, resources, prefix }) => {
  return (resources || []).map((data) => {
    // Generate a query link for included resources.
    // This is used to determine if the resource is a partial.
    const link = decodeURI(((data.links || {}).self || {}).href || '')
    const href = typeof (queryObject.fields || {})[data.type] === 'string'
      ? [link.split('?')[0], `fields[${data.type}]=${queryObject.fields[data.type]}`].join('?')
      : link

    store.addResource({
      prefix,
      resource: {
        data,
        links: { self: { href } },
      },
    })

    return { id: data.id, type: data.type }
  })
}

const DruxtStore = defineStore({
  id: 'druxt-store',

  state: () => ({
    collections: {},
    resources: {}
  }),

  /**
   * Actions.
   */
  actions: {
    /**
     * @name addCollection
     * @mutator {object} addCollection=collections Adds a JSON:API collection to the Vuex state object.
     * @param {addCollectionContext} context
     *
     * @example @lang js
     * this.$store.commit('druxt/addCollection', { collection, type, hash })
     */
    addCollection ( {collection, type, hash, prefix }) {
      if (!this.collections[type]) this.collections[type] = {};
      if (!this.collections[type][hash]) this.collections[type][hash] = {};

      // Parse the query.
      const link = decodeURI((((collection || {}).links || {}).self || {}).href || '')
      const query = link.split('?')[1] || ''
      const queryObject = getDrupalJsonApiParams(query).getQueryObject()

      // Store and dehydrate collection resources.
      collection.data = dehydrateResources({ store: this, prefix, queryObject, resources: collection.data })

      // Extract and store included resources.
      if (collection.included) {
        collection.included = dehydrateResources({ store: this, prefix, queryObject, resources: collection.included })
        delete collection.included
      }

      // Recursively merge new collection data into stored collection.
      collection = merge(this.collections[type][hash][prefix] || {}, collection, { arrayMerge: (dst, src) => src })

      this.collections[type][hash][prefix] = collection;
    },

    /**
     * @name addResource
     * @mutator {object} addResource=resources Adds a JSON:API resource to the Vuex state object.
     * @param {addResourceContext} context
     *
     * @example @lang js
     * this.$store.commit('druxt/addResource', { resource })
     */
    addResource ({prefix, resource, hash }) {
      if (hash) {
        console.warn('[druxt] The `hash` argument for `druxt/addResource` has been deprecated, see https://druxtjs.org/guide/deprecations.html#druxtstore-addresource-hash')
      }

      const { id, type } = (resource || {}).data || {}
      if (!id || !type) {
        // @TODO - Error?
        return
      }

      // Parse the query.
      const link = decodeURI((((resource || {}).links || {}).self || {}).href || '')
      const query = link.split('?')[1] || ''
      const queryObject = getDrupalJsonApiParams(query).getQueryObject()

      // Add cache flag to resource.
      const flag = typeof (queryObject.fields || {})[((resource || {}).data || {}).type] === 'string' ? '_druxt_partial' : '_druxt_full'
      resource[flag] = Date.now()

      // Ensure Resource type array is reactive.
      if (!this.resources[type]) this.resources[type] = {};
      if (!this.resources[type][id]) this.resources[type][id] = {};

      // Extract and store included data.
      if (resource.included) {
        dehydrateResources({ store: this, prefix, queryObject, resources: resource.included })
        delete resource.included
      }

      // Recursively merge new resource data into stored resource.
      resource = merge(this.resources[type][id][prefix] || {}, resource, { arrayMerge: (dst, src) => src })

      this.resources[type][id][prefix] = resource;
    },
    /**
     * Get collection of resources.
     *
     * @name getCollection
     * @action getCollection
     * @param {getCollectionContext} context
     * @return {object[]} Array of Drupal JSON:API resource data.
     *
     * @example @lang js
     * // Load all currently published Articles.
     * const resources = await this.$store.dispatch('druxt/getCollection', {
     *   type: 'node--article',
     *   query: new DrupalJsonApiParams().addFilter('status', '1'),
     * })
     */
    async getCollection ({ type, query, prefix }) {
      // Generate a hash using query data excluding the 'fields' and 'include' data.
      const queryObject = getDrupalJsonApiParams(query).getQueryObject()
      const hash = query ? md5(JSON.stringify({ ...queryObject, fields: {}, include: [] })) : '_default'

      // If collection hash exists, re-hydrate and return the data.
      if (((this.collections[type] || {})[hash] || {})[prefix]) {
        return {
          ...this.collections[type][hash][prefix],
          // Hydrate resource data.
          data: this.collections[type][hash][prefix].data.map((o) => ((this.resources[o.type][o.id] || {})[prefix] || {}).data)
        }
      }

      // Get the collection using the DruxtClient instance.
      const collection = await useDruxtClient().getCollection(type, query, prefix)

      // Store the collection in the DruxtStore.
      this.addCollection({ collection: { ...collection }, type, hash, prefix })

      return collection
    },

    /**
     * Get JSON:API Resource.
     *
     * - Executes query against Drupal JSON:API.
     * - Caches result in the Vuex store.
     * - Returns cached result from Vuex store when available.
     *
     * @name getResource
     * @action getResource=resources
     * @param {getResourceContext} context
     * @return {object} The Drupal JSON:API resource.
     *
     * @example @lang js
     * const resource = await this.$store.dispatch('druxt/getResource', { type: 'node--article', id })
     */
    async getResource ({ type, id, query, prefix }) {
      // Get the resource from the store if it's avaialble.
      const storedResource = ((this.resources[type] || {})[id] || {})[prefix] ?
        { ...this.resources[type][id][prefix] }
        : null

      // Parse the query.
      const queryObject = getDrupalJsonApiParams(query).getQueryObject()
      queryObject.include = Array.isArray(queryObject.include)
        ? queryObject.include.join(',')
        : queryObject.include

      // Ensure that includes are in the fields filter.
      if (queryObject.include && typeof (queryObject.fields || {})[type] === 'string') {
        const fields = queryObject.fields[type].split(',').filter((s) => s)
        const includes = queryObject.include.split(',').filter((s) => s && !s.includes('.'))
        queryObject.fields[type] = Array.from(
          new Set([...fields, ...includes])
        ).filter((s) => s).join(',')
      }

      // Hydrate included data based on the include query.
      let included = []
      if (queryObject.include && storedResource) {
        // Request included resources from druxt/getResource.
        const resources =
          await Promise.all(queryObject.include.split(',')
            .filter((s) => Object.keys((storedResource.data.relationships || {})).includes(s))
            .map((key) => {
              let { data } = storedResource.data.relationships[key]
              data = Array.isArray(data) ? data : [data]

              // Get any sub-includes, e.g., `media,media.image` becomes `image`.
              const include = queryObject.include.split(',')
                .filter((s) => s.startsWith(`${key}.`))
                .map((s) => s.slice(key.length + 1))
                .join(',')

              return data.filter((o) => typeof o === 'object' && o).map((o) => {
                return this.getResource( {
                  type: o.type,
                  id: o.id,
                  query: { ...queryObject, include },
                })
              })
            })
            .flat()
          )

        // Merge all nested, included resources.
        for (const include of resources) {
          included = [...included, include.data, ...include.included || []]
        }
        storedResource.included = included
      }

      // Return if we have the full resource.
      if ((storedResource || {})._druxt_full) {
        return storedResource
      }
      const isFull = typeof (queryObject.fields || {})[type] !== 'string'

      // Determine if we have all the requested field data.
      let fields = isFull ? true : (queryObject.fields || {})[type]
      if (storedResource && !isFull && fields) {
        const queryFields = fields.split(',')
        const resourceFields = [
          ...Object.keys(((storedResource || {}).data || {}).attributes || {}),
          ...Object.keys(((storedResource || {}).data || {}).relationships || {}),
        ]
        const missingFields = queryFields.filter((key) => !resourceFields.includes(key))
        fields = !!missingFields.length

        // Modify query to load additional fields, if required.
        queryObject.fields[type] = (missingFields || []).join(',') || undefined
      }

      // Request the resource from the DruxtClient if required.
      let resource
      if (!storedResource || fields) {
        resource = await this.$druxt.getResource(type, id, getDrupalJsonApiParams(queryObject), prefix)
        this.addResource({ prefix, resource: { ...resource } })
      }

      // Build resource to be returned.
      const result = { ...((this.resources[type] || {})[id] || {})[prefix] }

      // Merge included resources into resource.
      if (queryObject.include && ((resource || {}).included || (storedResource || {}).included)) {
        included = [
          ...(resource || {}).included || [],
          ...(storedResource || {}).included || [],
        ]
        result.included = Array.from(new Set(included.filter((o) => (o || {}).id).map((o) => o.id)))
          .map((id) => included.find((o) => o.id === id))
      }

      return result
    },
  }
});

export { DruxtStore }

/**
 * Parameters for the `addCollection` mutation.
 *
 * @typedef {object} addCollectionContext
 *
 * @param {object} collection - A collection of JSON:API resources.
 * @param {string} type - The JSON:API collection resource type.
 * @param {string} hash - An md5 hash of the query string.
 * @param {string} [prefix] - (Optional) The JSON:API endpoint prefix or langcode.
 *
 * @example @lang js
 * {
 *   collection: {
 *     jsonapi: {},
 *     data: [{}],
 *     links: {}
 *   },
 *   type: 'node--page',
 *   hash: '_default',
 *   prefix: 'en'
 * }
 */

/**
 * Parameters for the `addResource` mutation.
 *
 * @typedef {object} addResourceContext
 *
 * @param {string} [prefix] - (Optional) The JSON:API endpoint prefix or langcode.
 * @param {object} resource - The JSON:API resource.
 *
 * @example @lang js
 * {
 *   prefix: 'en',
 *   resource: {
 *     jsonapi: {},
 *     data: {},
 *     links: {}
 *   },
 * }
 */

/**
 * Parameters for the `getCollection` action.
 *
 * @typedef {object} getCollectionContext
 *
 * @param {string} type - The JSON:API collection resource type.
 * @param {DruxtClientQuery} [query] - A correctly formatted JSON:API query string or object.
 * @param {string} [prefix] - (Optional) The JSON:API endpoint prefix or langcode.
 *
 * @example @lang js
 * {
 *   type: 'node--page',
 *   query: new DrupalJsonApiParams().addFilter('status', '1')
 * }
 */

/**
 * Parameters for the `getResource` action.
 *
 * @typedef {object} getResourceContext
 *
 * @param {string} type - The JSON:API Resource type.
 * @param {string} id - The Drupal resource UUID.
 * @param {DruxtClientQuery} [query] - A correctly formatted JSON:API query string or object.
 * @param {string} [prefix] - (Optional) The JSON:API endpoint prefix or langcode.
 *
 * @example @lang js
 * {
 *   type: 'node--page',
 *   id: 'd8dfd355-7f2f-4fc3-a149-288e4e293bdd',
 *   prefix: 'en'
 * }
 */

/**
 * @typedef {string|object} DruxtClientQuery
 *
 * A correctly formatted JSON:API query string or object.
 *
 * @example
 * page[limit]=5&page[offset]=5
 *
 * @example @lang js
 * new DrupalJsonApiParams().addPageLimit(5)
 *
 * @see {@link https://www.npmjs.com/package/drupal-jsonapi-params}
 */
