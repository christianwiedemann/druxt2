import { resolveDynamicComponent } from 'vue'
import {Component} from "../index";

const isComponent = name => typeof resolveDynamicComponent(name) !== 'string'

export const useComponent = (suggestions = [], props):Component => {
  for (let i = 0; i < suggestions.length; i++) {
    const name = suggestions[i]
    if (isComponent(name)) {
      return {
        is: name,
        props
      }
    }
  }

  return {
    is: 'DruxtDebug',
    props: {
      json: suggestions
    }
  }
}
