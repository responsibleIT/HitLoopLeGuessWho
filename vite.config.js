import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
   base: '/HitLoop/',
  server: {
    port: 3000,
    hmr: true
  },
  css: {
    devSourcemap: true
  },
  build: {
    outDir: 'docs', 
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
