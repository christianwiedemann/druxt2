import { resolveDynamicComponent } from 'vue'
import { pascalCase, splitByCase } from 'scule'
import { DruxtTheme } from '../index'

const suggestionsOptions = (theme: string, options: [[]], lang = null) => {
  // Build list of available components.
  const components = []
  for (const set of options.filter(set => Array.isArray(set))) {
    const variants = []

    for (const item of set.filter(o => o)) {
      // Build array of name parts.
      const parts:string[] = variants.length ? [...variants[0].parts] : []
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
  return sorted
}
const isComponent = name => typeof resolveDynamicComponent(name) !== 'string'

export const druxtTheme = (theme: string, options: [[]], props = {}, slots = {}, lang = null):DruxtTheme => {
  let suggestions:string[] = []
  const casedTheme = pascalCase(theme)
  if (!Array.isArray(options)) {
    options = [[]]
  }
  const suggestionsOpt = suggestionsOptions(casedTheme, options, lang)
  suggestions = suggestionsOpt.map(o => pascalCase(o.name)) || []
  suggestions.push(casedTheme)
  return {
    suggestions,
    props,
    slots,
    is: () => {
      for (const suggestion of suggestions) {
        if (suggestion.endsWith('!')) {
          return suggestion
        }
        if (isComponent(suggestion)) {
          return suggestion
        }
      }
      return 'DruxtDebug'
    }
  }
}
