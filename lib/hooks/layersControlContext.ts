import { inject, nextTick, onUnmounted, provide, type InjectionKey, type ShallowRef } from 'vue'
import type { LMapContext } from '../types'
import { useMapContext } from './mapContext'

type Control = L.Control.Layers

type LayersControlContext = {
    mapCtx: LMapContext
    readonly control: Control
    readonly addLayer: (layer: L.Layer, label: string) => void
    readonly removeLayer: (layer: L.Layer) => void
}

const key: InjectionKey<LayersControlContext>
    = Symbol('@vue3-components/leaflet:hooks/layersControlContext')

export type LayersControlTargetType = 'baseLayers' | 'overlays'

export function setupLayersControlContext(
    control: Readonly<ShallowRef<Control>>,
    target: LayersControlTargetType
) {
    const mapCtx = useMapContext()

    let lastBaseLayer: L.Layer | undefined
    onUnmounted(() => {
        lastBaseLayer = undefined
    })

    const ctx: LayersControlContext = {
        mapCtx: useMapContext(),
        get control() { return control.value },
        addLayer: (x, y) => {
            if (target === 'baseLayers') {
                x.remove()
                control.value.addBaseLayer(x, y)
                // lastBaseLayer?.remove()
                lastBaseLayer = x
                nextTick(() => {
                    if (lastBaseLayer === x) {
                        x.addTo(mapCtx.map)
                    }
                })
            } else {
                control.value.addOverlay(x, y)
                x.addTo(mapCtx.map)
            }
        },
        removeLayer: (x) => control.value.removeLayer(x)
    }

    provide(key, ctx)
    return ctx
}

export function useLayersControlContext() {
    const result = inject(key, null)
    return result
}
