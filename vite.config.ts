import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'
import prefixSelector from 'postcss-prefix-selector'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  css: {
    postcss: {
      plugins: [
        // Scope all generated CSS (including Tailwind base) to the library wrapper
        // Only apply during build; in dev we want unscoped styles for the playground
        ...(command === 'build'
          ? [
              prefixSelector({
                prefix: '.vue-music-flow',
                transform: function (prefix, selector) {
                  // Replace top-level globals with the scope to prevent collisions
                  if (
                    selector.startsWith(':root') ||
                    selector.startsWith('html') ||
                    selector.startsWith('body') ||
                    selector.startsWith(':host')
                  ) {
                    return prefix
                  }
                  // Don't double-prefix
                  if (selector.startsWith(prefix)) return selector
                  // Keyframes and font-face have no selectors; plugin ignores them
                  return `${prefix} ${selector}`
                },
              }),
            ]
          : []),
      ],
    },
  },
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
}))
