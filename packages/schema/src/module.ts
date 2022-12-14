import { fileURLToPath } from 'url'
import {
  defineNuxtModule,
  addTemplate,
  createResolver,
  resolveModule,
  addImports, installModule,
} from '@nuxt/kit'
import consola from 'consola'
import { DruxtSchema } from './runtime/schema'

const SchemaNuxtModule = defineNuxtModule({
  meta: {
    name: 'druxt-schema',
    configKey: 'druxt'
  },

  async setup (options, nuxt) {
    // Add dynamic imports for vite.
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)


    const resolveRuntimeModule = (path: string) => resolveModule(path, { paths: resolve('./runtime') })

    // Register composables
    addImports([
      { name: 'useSchema', as: 'useSchema', from: resolveRuntimeModule('./composables/useSchema') },
    ])

    // @ts-ignore
    const { baseUrl } = options
    const axios = require('axios').default;
    const drupalSchema = new DruxtSchema(baseUrl, {
      axios,
      ...options,
      proxy: {}
    })
    const { schemas } = await drupalSchema.get()
    // Throw error if no schema files generated.
    if (!Object.entries(schemas).length) {
      throw new Error('No Drupal Schema files generated.\n Have you created any content types yet?')
    }

    const templatesDir = fileURLToPath(new URL('../templates', import.meta.url))
    nuxt.options.build.transpile.push(templatesDir)
    for (const name in schemas) {
      const schema = schemas[name]
      if (typeof schema === 'undefined') { continue }
      addTemplate({
        src: resolve(templatesDir, 'schema.json'),
        filename: resolve(`schemas/${name}.json`),
        options: { schema },
        write: true
      })
    }

    await installModule('@druxt2/druxt')
    consola.success('Drupal schema files generated!')
  }
})
export default SchemaNuxtModule
