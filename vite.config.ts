import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import external from 'vite-plugin-external'
import { replace } from './build/plugins/replace'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        external({
            externals: {
                'leaflet': 'L',
                'leaflet.markercluster': 'L',
            }
        }),
        replace()
    ],
})
