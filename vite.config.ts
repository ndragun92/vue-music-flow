import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueMusicFlow',
      formats: ['es', 'umd'],
      fileName: (format) => `vue-music-flow.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'wavesurfer.js'],
      output: {
        globals: {
          vue: 'Vue',
          'wavesurfer.js': 'WaveSurfer',
          '@vueuse/core': 'VueUse',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
