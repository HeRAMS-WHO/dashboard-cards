import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      customElement: false,
      generate: "dom"
    },
    emitCss: false
  })],
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: 'src/cards/BaseCard.svelte',
      formats: ['es']
    },
    rollupOptions: {
    },

  }
})
