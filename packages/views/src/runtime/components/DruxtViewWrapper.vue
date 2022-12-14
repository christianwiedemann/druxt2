<script>
import merge from 'deepmerge'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { parse, stringify } from 'qs'
import { DruxtViewsStore } from '../stores/views';
import { DruxtStore, druxtTheme, druxtRender, useDruxtClient } from '#imports';

/**
 * The DruxtView component renders Drupal Views using configuration and
 * results provided by the Drupal View and the JSON:API Views module.
 *
 * The component renders slots for  the View's headers, footers, entity results,
 * exposed sorts and filters, and supports contextual filters.
 *
 * @example @lang vue
 * <DruxtView display-id="block_1" view-id="promoted_items" />
 *
 * @example <caption>View with contextual filter</caption> @lang vue
 * <DruxtView
 *   :arguments="[entity.attributes.drupal_internal__nid]"
 *   display-id="block_1"
 *   view-id="articles_aside"
 * />
 *
 * @example <caption>DruxtView Wrapper component boilerplate</caption> @lang vue
 * <template>
 *   <DruxtDebug :json="results" />
 * </template>
 *
 * <script>
 * import { DruxtViewsViewMixin } from 'druxt-views'
 * export default {
 *   mixins: [DruxtViewsViewMixin]
 * }
 *
 * @example <caption>DruxtView with template injection</caption> @lang vue
 * <DruxtView>
 *   <template #default="{ results }">
 *     <!-- Do whatever you want here -->
 *     <DruxtDebug :json="results" />
 *   </template>
 * </DruxtView>
 */
export default {
  name: 'DruxtViewWrapper',

  /**
   * Vue.js Properties.
   */
  props: {
    lang: {
      type: String,
      required: true
    },

    /**
     * Views contextual filters.
     *
     * @type {array}
     * @default []
     *
     * @example
     * <DruxtView :arguments="[1, 2, 3]" display-id="block_1" view-id="articles_aside" />
     */
    arguments: {
      type: Array,
      default: () => [],
    },

    /**
     * The View Display ID.
     *
     * @type {string}
     * @default default
     *
     * @example
     * <DruxtView display-id="page_1" view-id="frontpage" />
     */
    displayId: {
      type: String,
      default: 'default',
    },

    /**
     * JSON:API Resource type.
     *
     * @type {string}
     * @default view--view
     */
    type: {
      type: String,
      default: 'view--view',
    },

    /**
     * The View UUID.
     *
     * @type {string}
     *
     * @example
     * <DruxtView uuid="f6c38097-d534-4bfb-87d9-09526fe44e9c" />
     */
    uuid: {
      type: String,
      default: null,
    },

    /**
     * The View ID.
     *
     * @type {string}
     *
     * @example
     * <DruxtView view-id="frontpage" />
     */
    viewId: {
      type: String,
      default: null,
    }
  },

  /**
   * @property {object} model - The model object.
   * @property {object} resource - The JSON:API Views resource.
   * @property {object} view - The View JSON:API resource.
   */
  data() {
    // Stringify and parse the query object to fix nested objects.
    const model = parse(stringify(this.$route.query))

    return {
      model: {
        filter: model.filter || {},
        page: parseInt(model.page) || null,
        sort: model.sort || null,
      },
      resource: null,
      view: false
    }
  },

  fetchKey(getCounter) {
    const parts = ['DruxtView', this.viewId || this.uuid, this.displayId].filter((o) => o)
    return [...parts, getCounter(parts.join(':'))].join(':')
  },

  /** */
  computed: {
    /**
     * IDs of displays to be attached after the view.
     *
     * @type {string[]}
     */
    attachments_after() {
      if (!((((this.view || {}).data || {}).attributes || {}).display)) return false

      const displays = this.view.data.attributes.display
      return Object.keys(displays).filter(key => {
        return displays[key].display_plugin === 'attachment'
          && displays[key].display_options.attachment_position === 'after'
          && typeof displays[key].display_options.displays[this.displayId] !== 'undefined'
        })
    },

    /**
     * IDs of displays to be attached before the view.
     *
     * @type {string[]}
     */
    attachments_before() {
      if (!((((this.view || {}).data || {}).attributes || {}).display)) return false

      const displays = this.view.data.attributes.display
      return Object.keys(displays).filter(key => {
        return displays[key].display_plugin === 'attachment'
          && displays[key].display_options.attachment_position === 'before'
          && typeof displays[key].display_options.displays[this.displayId] !== 'undefined'
        })
    },

    /**
     * The total item count.
     *
     * @type {integer}
     */
    count() {
      return parseInt(((this.resource || {}).meta || {}).count) || 0
    },

    /**
     * The View Display object.
     *
     * @type {object}
     */
    display() {
      if (!(((this.view || {}).data || {}).attributes || {}).display) return {}

      if (this.displayId === 'default') return this.view.data.attributes.display[this.displayId]

      return merge(
        this.view.data.attributes.display['default'],
        this.view.data.attributes.display[this.displayId]
      )
    },

    /**
     * Exposed filters.
     *
     * @type {object[]}
     */
    filters() {
      return Object.values(((this.display || {}).display_options || {}).filters || {}).filter(filter => filter.exposed)
    },

    /**
     * The View Headers data.
     *
     * @type {@object}
     */
    headers() {
      if (!this.display) return []

      return (this.display.display_options || {}).header || []
    },

    /**
     * The View mode for the results entities.
     *
     * @type {string}
     */
    mode() {
      if (!this.display || !this.display.display_options) return 'default'

      if (!this.display.display_options.row.type.includes('entity:')) return 'default'

      return (this.display.display_options.row.options || {}).view_mode || 'default'
    },

    /**
     * The displays pager settings.
     *
     * @type {object}
     */
    pager() {
      return ((this.display || {}).display_options || {}).pager || false
    },

    /**
     * The JSON:API Views results.
     *
     * @type {object[]}
     */
    results() {
      return (this.resource || {}).data || []
    },

    /**
     * Whether a pager should be shown.
     *
     * @type {boolean}
     */
    showPager() {
      return this.pager.type && this.pager.type !== 'none'
    },

    /**
     * Whether Exposed sorts are available and should be displayed.
     *
     * @type {boolean}
     */
    showSorts() {
      return !!(((((this.display || {}).display_options || {}).exposed_form || {}).options || {}).expose_sort_order && this.sorts.length)
    },

    /**
     * Exposed sorts.
     *
     * @type {object[]}
     */
    sorts() {
      return Object.values(((this.display || {}).display_options || {}).sorts || {}).filter(sort => sort.exposed)
    }
  },


  methods: {
    /**
     * Filters update event handler.
     */
    onFiltersUpdate() {
      this.model.page = null
      this.model.sort = null
    },

  },

  async setup(props) {
    const viewsStore = DruxtViewsStore();
    const druxtStore = DruxtStore();
    const druxtClient = useDruxtClient();

    /**
     * Builds the query for the JSON:API request.
     *
     * @param {ModuleSettings} settings - The merged module and component settings object.
     *
     * @return {Query}
     */
    const getQuery = (settings = {}) => {
      const query = {}
      const resourceTypes = (settings.query || {}).resourceTypes || []

      // Check all filters for 'bundle' plugin with bundle data, and use if
      // found build resourceTypes array.
      if ((settings.query || {}).bundleFilter === true) {
        const filters = ((props.display || {}).display_options || {}).filters || []
        Object.values(filters).map((filter) => {
          if (filter.plugin_id === 'bundle' && filter.value) {
            Object.keys(filter.value).map((bundle) => {
              resourceTypes.push(`${filter.entity_type}--${bundle}`)
            })
          }
        })
      }

      // Filter fields.
      if ((resourceTypes || []).length) {
        for (const resourceType of resourceTypes) {
          query[`fields[${resourceType}]`] = ['uuid', ...(settings.query || {}).fields || []].join(',')
        }
      }

      // Contextual filters.
      if (props.arguments.length) {
        for (const index in props.arguments) {
          query[`views-argument[${index}]`] = props.arguments[index]
        }
      }
      return query
    };


    let view;
    if (!props.view && (props.uuid || props.viewId)) {
      if (props.uuid) {
        view = await druxtStore.getResource({
          prefix: props.lang,
          type: props.type,
          id: props.uuid,
        })
      } else {
        const collection = await druxtStore.getCollection({
          prefix: props.lang,
          type: props.type,
          query: new DrupalJsonApiParams().addFilter('drupal_internal__id', props.viewId)
        })
        view = {data: collection.data[0]}
      }
    }
    const viewId = props.viewId || (((view || {}).data || {}).attributes || {}).drupal_internal__id

    if (viewId) {
      const query = await getQuery()
      const resource = await viewsStore.getResults({
        displayId: props.displayId,
        prefix: props.lang,
        query: stringify(query),
        viewId,
        druxtClient
      })
      return  {
        resource,
        view
      }
    }


  },
  render () {
    const mappedResults = this.results.map((result) => druxtTheme('DruxtEntityWrapper', [[]], {
      viewMode: this.mode,
      entity: result,
      key: result.id,
      lang: this.lang,
      type: result.type,
      uuid: result.id
    }))
    const druxtView = druxtTheme('DruxtView', [
      [this.viewId || ((this.view.data || {}).attributes || {}).drupal_internal__id, this.displayId],
      [this.uuid || (this.view.data || {}).id, this.displayId],
      [this.displayId]
    ], {context: {viewId: this.viewId, displayId:  this.displayId, view: this.view}}, {results: mappedResults});

    return druxtRender(druxtView)
  },

}

/**
 * Provides the available component naming options for the Druxt Wrapper.
 *
 * @typedef {array[]} ComponentOptions
 *
 * @example @lang js
 * [
 *   'DruxtView[ViewId][DisplayId][Langcode]',
 *   'DruxtView[ViewId][DisplayId]',
 *   'DruxtView[ViewId][Langcode]',
 *   'DruxtView[ViewId]',
 *   'DruxtView[UUID][DisplayId][Langcode]',
 *   'DruxtView[UUID][DisplayId]',
 *   'DruxtView[UUID][Langcode]',
 *   'DruxtView[UUID]',
 *   'DruxtView[DisplayId][Langcode]',
 *   'DruxtView[DisplayId]',
 * ]
 *
 * @example <caption>featured_articles (default)</caption> @lang js
 * [
 *   'DruxtViewFeaturedArticlesDefaultEn',
 *   'DruxtViewFeaturedArticlesDefault',
 *   'DruxtViewFeaturedArticlesEn',
 *   'DruxtViewFeaturedArticles',
 *   'DruxtView16f5d68e5bae4d7aa61c6b2bc3b6d3b6DefaultEn',
 *   'DruxtView16f5d68e5bae4d7aa61c6b2bc3b6d3b6Default',
 *   'DruxtView16f5d68e5bae4d7aa61c6b2bc3b6d3b6En',
 *   'DruxtView16f5d68e5bae4d7aa61c6b2bc3b6d3b6',
 *   'DruxtViewDefaultEn',
 *   'DruxtViewDefault',
 * ]
 */

/**
 * Provides settings for the View module, via the `nuxt.config.js` `druxt.views`
 * or the Wrapper component `druxt` object.
 *
 * @typedef {object} ModuleSettings
 * @param {boolean} bundleFilter - Whether to automatically detect Resource types to filter, based on the View `bundle` filter.
 * @param {string[]} fields - An array of fields to filter from the JSON:API Views Resource types.
 * @param {string[]} resourceTypes - An array of Resource types to be used by the Fields filter.
 *
 * @example @lang js
 * {
 *   bundleFilter: false,
 *   fields: [],
 *   resourceTypes: []
 * }
 *
 * @example @lang vue
 * <script>
 * export default {
 *   druxt: {
 *     query: {
 *       bundleFilter: false,
 *       fields: ['title']
 *       resourceTypes: ['node--article'],
 *     },
 *   }
 * }
 */

/**
 * Provides propsData for the DruxtWrapper.
 *
 * @typedef {object} PropsData
 * @param {integer} count - The total item count.
 * @param {object} display - The View Display object.
 * @param {string} mode - The View mode for the results entities.
 * @param {object} pager - The displays pager settings.
 * @param {object[]} results - The JSON:API Views results.
 * @param {object} view - The View JSON:API resource.
 *
 * @example @lang js
 * {
 *   count: 8,
 *   display: {},
 *   mode: 'card',
 *   pager: {
 *     options: {},
 *     type: 'mini',
 *   },
 *   results: [],
 *   view: {},
 * }
 */

/**
 * Provides scoped slots for use in the Wrapper component.
 *
 * @typedef {object} ScopedSlots
 * @param {function} header - The View header.
 * @param {function} filters - The Exposed filters.
 * @param {function} sorts - The Exposed sorts.
 * @param {function} attachments_before - Views attached before current display.
 * @param {function} results - The results as DruxtEntity components, or empty results output.
 * @param {function} pager - The View pager.
 * @param {function} attachments_after - Views attached after current display.
 * @param {function} default - All of the above.
 *
 * @example @lang js
 * {
 *   header: () => {},
 *   filters: () => {},
 *   sorts: () => {},
 *   attachments_before: () => {},
 *   results: () => {},
 *   pager: () => {},
 *   attachments_after: () => {},
 *   default: () => {},
 * }
 *
 * @example <caption>DruxtView**ViewId**.vue</caption> @lang vue
 * <template>
 *   <div>
 *     <slot name="header" />
 *     <slot name="results" />
 *     <slot name="pager" />
 *   </div>
 * </template>
 */
</script>
