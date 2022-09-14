// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import typescript from "rollup-plugin-typescript2"

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'druxt',
      // the proper extensions will be added
      fileName: 'index',
      format: 'mjs',
      formats: [
        'es',
        'cjs',
        'umd'
      ]
    },

    rollupOptions: {
      plugins: [
        typescript({
          check: false, // too much noise
          clean: true,
          abortOnError: false,
        }),

      ],
    }
  }
})
