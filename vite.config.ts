import { fileURLToPath, URL } from 'node:url'

import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const appDir = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    replace({
            preventAssignment: true,
            '__component_name__': (file) => {
                const extname = path.extname(file)
                const basename = path.basename(file, extname)
                const result = basename === 'index'
                    ? path.basename(path.dirname(file))
                    : basename

                return JSON.stringify(result)
            }
    })
  ],
  resolve: {
    alias: {
      '@': path.join(appDir, 'src'),
      "@vue3-components/leaflet": path.join(appDir, 'lib'),
    },
  },
})
