import replace from '@rollup/plugin-replace'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import { defineConfig } from 'vite'
import external from 'vite-plugin-external'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        jsx() as any,
        external({
            externals: {
                'leaflet': 'L',
                'leaflet.markercluster': 'L',
            }
        }),
        replace({
            preventAssignment: true,

            '__component_name__'(file) {
                const extname = path.extname(file)
                const basename = path.basename(file, extname)
                const result = basename === 'index'
                    ? path.basename(path.dirname(file))
                    : basename

                return JSON.stringify(result)
            }
        })
    ],
})
