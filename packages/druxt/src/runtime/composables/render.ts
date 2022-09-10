import { h, resolveComponent } from 'vue'
import { Component } from '../index'

export const render = (component:Component, slots = {}) => {
  const componentIs = component.is()
  const resolvedComponent = !componentIs.endsWith('!') ? resolveComponent(componentIs) : componentIs.substring(0, componentIs.length - 1)
  const collectSlots = {}
  const renderedSlots = {}
  if (component.slots) {
    for (const slotName of Object.keys(component.slots)) {
      const slots = component.slots[slotName]
      if (!collectSlots[slotName]) {
        collectSlots[slotName] = []
      }
      if (Array.isArray(slots)) {
        for (const slotItem of slots) {
          collectSlots[slotName].push(
            render(slotItem)
          )
        }
      }
    }
    for (const slotName of Object.keys(component.slots)) {
      renderedSlots[slotName] = () => collectSlots[slotName];
    }
  }
  const props = component.is() === 'DruxtDebug' ? { title: 'Unable to resolve component', json: {suggestions: component.suggestions, props: component.props, slots} } : {};
  const componentH = h(resolvedComponent, {...component.props, ...props, druxtComponent: component}, {...renderedSlots, ...slots})
  return componentH
}
