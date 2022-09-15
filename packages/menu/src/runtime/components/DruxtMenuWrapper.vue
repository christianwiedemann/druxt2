<script>

import merge from 'deepmerge'

import {DruxtMenuStore} from "../stores/menu";
import {druxtTheme, druxtRender} from "#imports";

export default {
  name: 'DruxtMenuWrapper',

  /** */
  props: {
    /**
     * The depth of the menu items to render.
     *
     * @example @lang vue
     * <DruxtMenu :depth="1" />
     *
     * @type {number}
     * @default 0
     */
    depth: {
      type: Number,
      default: 0,
    },

    /**
     * Class(es) to apply to the menu items.
     *
     * @type {string}
     */
    itemClass: {
      type: String,
      default: ''
    },

    /**
     * Component or element to render the menu items.
     *
     * @type {string}
     * @default li
     */
    itemComponent: {
      type: String,
      default: 'li'
    },

    /**
     * The maximum depth of the menu tree data to load.
     *
     * @example @lang vue
     * <DruxtMenu :max-depth="4" />
     *
     * @type {number}
     */
    maxDepth: {
      type: Number,
      default: null,
    },

    /**
     * The minimum depth of the menu tree.
     *
     * @example @lang vue
     * <DruxtMenu :min-depth="2" />
     *
     * @type {number}
     * @default 0
     */
    minDepth: {
      type: Number,
      default: 0,
    },

    /**
     * The name of the menu to load and render.
     *
     * @example @lang vue
     * <DruxtMenu name="main" />
     *
     * @type {string}
     * @default main
     */
    name: {
      type: String,
      default: 'main'
    },

    /**
     * The menu parent ID to use as the root of the menu.
     *
     * @example @lang vue
     * <DruxtMenu parent-id="views_view:views.recipes.page_1" />
     *
     * @type {string}
     */
    parentId: {
      type: String,
      default: null,
    },

    /**
     * Class(es) to apply to parent menu items.
     *
     * @type {string}
     */
    parentClass: {
      type: String,
      default: ''
    },

    /**
     * Component or element to render parent menu items.
     *
     * @type {string}
     * @default li
     */
    parentComponent: {
      type: String,
      default: 'li'
    },

    /**
     * Class(es) to apply to a wrapper around parent menu items.
     *
     * @type {string}
     */
    parentWrapperClass: {
      type: String,
      default: ''
    },

    /**
     * Component or element to render a wrapper around parent menu items.
     *
     * @type {string}
     * @default ul
     */
    parentWrapperComponent: {
      type: String,
      default: 'ul'
    }
  },

  /** */
  computed: {
    /**
     * The processed Menu items.
     *
     * @type {objects[]}
     * @deprecated
     */
    items: ({model}) => model,

    /**
     * The active route trail.
     *
     * @type {string[]}
     */
    trail: ({$route}) => {
      const paths = []
      const parts = $route.path.substring(1).split('/')

      for (const key in parts) {
        const path = [key > 0 ? paths[key - 1] : '', parts[key]].join('/')
        paths.push(path)
      }

      return paths
    },

  },

  /** */
  watch: {
    /**
     * Updates menu when available Entities change.
     */
    entities() {

    },
  },
  async setup(props) {
    const query = {
      fields: ['description', 'options'],
      requiredOnly: false,
    };

    const depth = props.depth;
    const store = DruxtMenuStore()
    const lang = props.lang;
    const name = props.name;
    const parentId = props.parentId;
    const getMenuItems = (entity = null, position = 0) => {
      const items = []
      position += 1

      if (!depth || position <= depth) {
        let parent = parentId || null
        if (entity) {
          parent = entity.id

          // Ensure that the parent is prefixed correctly if we're not using the JSON:API Menu Items module.
          if (typeof entity.attributes.bundle !== 'undefined') {
            parent = [entity.attributes.bundle, entity.id].join(':')
          }
        }

        const entities = store.getEntitiesByFilter(
          (key, entities, prefix) => {
            return entities[prefix][key].attributes.menu_name === name && entities[prefix][key].attributes.parent === parent
          },
          lang
        )

        for (const key in entities) {
          const entity = entities[key]
          items.push({ entity, children: getMenuItems(entity, position)})
        }
      }
      return items
    }
    await store.get({ name: props.name, query })
    const items = getMenuItems();

    const slots = [];
    items.forEach((item)=>{
      slots.push(druxtTheme('DruxtMenuItemWrapper', [['default', name]], {item, menuName: name}))
    })
    const menuTheme = druxtTheme('DruxtMenu', [['default', name, ]], {}, {items: slots});
    return () => {
      return druxtRender(menuTheme);
    }

  },

  /** DruxtModule settings. */
}

/**
 * Provides the available naming options for the Wrapper component.
 *
 * @typedef {array[]} ComponentOptions
 *
 * @example @lang js
 * [
 *   'DruxtMenu[Name][Langcode]',
 *   'DruxtMenu[Name]',
 *   'DruxtMenu[Default][Langcode]',
 *   'DruxtMenu[Default]',
 * ]
 *
 * @example <caption>Main menu (default)</caption> @lang js
 * [
 *   'DruxtMenuMainEn',
 *   'DruxtMenuMain',
 *   'DruxtMenuDefaultEn',
 *   'DruxtMenuDefault',
 * ]
 */

/**
 * Provides settings for the Menu module, via the `nuxt.config.js` `druxt.menu`
 * or the Wrapper component `druxt` object.
 *
 * @typedef {object} ModuleSettings
 * @param {string[]} fields - An array of fields to filter all JSON:API Menu queries.
 * @param {boolean} requiredOnly - Whether to automatically filter to module defined minimum required fields.
 *
 * @example @lang js
 * {
 *   fields: [],
 *   requiredOnly: true,
 * }
 *
 * @example @lang vue
 * <script>
 * export default {
 *   druxt: {
 *     query: {
 *       fields: ['description', 'options']
 *       requiredOnly: false,
 *     },
 *   }
 * }
 */

/**
 * Provides propsData for use in the Wrapper component.
 *
 * @typedef {object} PropsData
 * @param {object[]} items - The Menu items structured data.
 * @param {object[]} value - The Menu items structured data.
 *
 * @example @lang js
 * {
 *   items: [
 *     {
 *       children: [],
 *       entity: {},
 *     },
 *   ],
 *   value: [
 *     {
 *       children: [],
 *       entity: {},
 *     },
 *   ],
 * }
 */

/**
 * Provides scoped slots for use in the Wrapper component.
 *
 * @typedef {object} ScopedSlots
 * @param {function} default - All menu items using the DruxtMenuItem component
 *
 * @example <caption>DruxtMenu**Name**.vue</caption> @lang vue
 * <template>
 *   <div>
 *     <slot />
 *   </div>
 * </template>
 */
</script>
