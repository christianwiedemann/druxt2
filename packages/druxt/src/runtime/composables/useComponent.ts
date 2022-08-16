import { pascalCase, splitByCase } from 'scule'
import { Component } from '../index'
import {resolveDynamicComponent} from "vue";


const componentOptions = (theme, options: [[]], lang = null) => {
  // Build list of available components.
  const components = []
  for (const set of options.filter(set => Array.isArray(set))) {
    const variants = []

    for (const item of set.filter(o => o)) {
      // Build array of name parts.
      const parts = variants.length ? [...variants[0].parts] : []
      parts.push(pascalCase(splitByCase(item)))

      // Convert parts into a pascalCase component name.
      const name = pascalCase([theme, ...parts])

      // Store set variant data to be used in next set item.
      variants.unshift({ name, parts })

      // Add langcode suffixed component option.
      if (lang) {
        const langcodeName = pascalCase([name, ...parts, lang])
        components.push({
          name: langcodeName,
          parts: [...parts, lang]
        })
      }

      // And component option.
      components.push({
        name,
        parts
      })
    }
  }

  // Filter unique components.
  const unique = components.filter((s => o => !s.has(o.name) && s.add(o.name))(new Set()))

  // Sort items by parts length.
  const sorted = unique.sort((a, b) => b.parts.length - a.parts.length)
  return sorted;
}
const isComponent = name => typeof resolveDynamicComponent(name) !== 'string'

export const useComponent = (theme, options: [[]] = [[]], props = {}, slots: {}, lang = null):Component => {
  if (!Array.isArray(options)) {
    options = [[]];
  }
  const compOpt = componentOptions(theme, options, lang);
  const suggestions = compOpt.map(o => o.name) || [];
  suggestions.push(theme);
  return {
    suggestions,
    props,
    slots,
    is: () => {
      for (const suggestion of suggestions) {
        if (suggestion.endsWith('!')) {
          return suggestion;
        }
        if (isComponent(suggestion)) {
          return suggestion
        }
      }
      return 'DruxtDebug'
    }
  }
}
