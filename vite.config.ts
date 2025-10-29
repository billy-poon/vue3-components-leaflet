import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import external from 'vite-plugin-external'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        external({
            externals: {
                'leaflet': 'L',
                // cSpell: ignore markercluster
                'leaflet.markercluster': 'L',
            }
        })
    ],
})
