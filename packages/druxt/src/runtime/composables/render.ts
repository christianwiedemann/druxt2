import {h, resolveComponent, resolveDynamicComponent} from 'vue'
import {Component} from "../index";

export const render = (component:Component, wrapper:Component = null) => {
  const resolvedComponent = resolveComponent(component.is)
  if (wrapper !== null) {
    const resolveWrapper = resolveComponent(wrapper.is)
    return h(resolveWrapper, wrapper.props, h(resolvedComponent, component.props));
  } else {
    return h(resolvedComponent, component.props);
  }
}
