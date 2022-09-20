import { h, resolveComponent } from 'vue'
import {DruxtTheme} from '../index'

export const druxtRender = (druxtTheme:DruxtTheme, slots = {}) => {
  const componentIs = druxtTheme.is()
  const resolvedComponent = !componentIs.endsWith('!') ? resolveComponent(componentIs) : componentIs.substring(0, componentIs.length - 1)
  const collectSlots = {}
  const renderedSlots = {}
  if (druxtTheme.slots) {
    for (const slotName of Object.keys(druxtTheme.slots)) {
      const slots = druxtTheme.slots[slotName]
      if (!collectSlots[slotName]) {
        collectSlots[slotName] = []
      }
      if (Array.isArray(slots)) {
        for (const slotItem of slots) {
          collectSlots[slotName].push(
            druxtRender(slotItem)
          )
        }
      }
    }
    for (const slotName of Object.keys(druxtTheme.slots)) {
      renderedSlots[slotName] = () => collectSlots[slotName];
    }
  }
  const props = druxtTheme.is() === 'DruxtDebug' ? { title: 'Unable to resolve theme', json: {druxtTheme, slots: {...slots, ...druxtTheme.slots}} } : {};
  const componentH = h(resolvedComponent, {...druxtTheme.props, ...props}, {...renderedSlots, ...slots})

  return componentH
}
