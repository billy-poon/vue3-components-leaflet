import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
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
                // cSpell: ignore markercluster
                'leaflet.markercluster': 'L',
            }
        })
    ],
})
