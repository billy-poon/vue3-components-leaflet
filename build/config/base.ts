import { defineConfig } from 'rollup'

export const externalGlobals = {
    'vue': 'Vue',
    'leaflet': 'L',
    'leaflet.markercluster': 'L',
} as const

export function defineBaseConfig() {
    return defineConfig({
        external: Object.keys(externalGlobals),
    })
}
