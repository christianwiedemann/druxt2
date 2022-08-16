<script>
import {useDruxtMenuTrial} from "../composables/useDruxtMenu";

/**
 * Used by the DruxtMenu component to render individual Druxt Wrapper themeable
 * menu items.
 */
export default {
  name: 'DruxtMenuItemWrapper',

  /** */
  props: {
    /**
     * The menu item.
     *
     * @type {object}
     * @required
     */
    item: {
      type: Object,
      required: true
    },
    menuName: {
      type: String,
      required: true
    }
  },
  /** */
  computed: {
    /**
     * Class(es) for the menu item.
     *
     * @type {string}
     */
    classes: ({item}) => {
      const classes = [];
      if (useDruxtMenuTrial().includes(item.entity.attributes.url)) classes.push('active-trail')
      return classes.join(' ')
    },

    /**
     * The `to` attribute for the menu item.
     *
     * @type {object}
     */
    to: ({ item }) =>
        ((item.entity.attributes.link || {}).uri || '').startsWith('internal:')
        && (!item.entity.attributes.route || item.entity.attributes.route.name)
            ? item.entity.attributes.link.uri.split(':')[1]
            : false
  },

  methods: {
    /**
     * Returns a menu link components.
     */
    getLink(entity = {}) {
      if (!entity.attributes) return false

      // Render external links.
      if (!this.to) {
        return useComponent('a!', [[]], { href: entity.attributes.url || (entity.attributes.link || {}).uri, innerHTML: entity.attributes.title })
      }
      // Render internal links.
      return useComponent('DruxtMenuLink', [['Default']], { to: this.to, title: entity.attributes.title})
    },
  },
  render() {
    const itemComponent = useComponent('DruxtMenuItem', [['default', this.menuName]], {classes: this.classes}, {link: [this.getLink(this.item.entity)]});
    return render(itemComponent)
  },
}
</script>
