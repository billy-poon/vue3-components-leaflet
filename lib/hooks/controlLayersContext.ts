import { inject, nextTick, onUnmounted, provide, type InjectionKey, type Ref } from 'vue'
import { useMapContext } from './mapContext'

export type ControlLayersContext = {
    control: L.Control.Layers
    addLayer(layer: L.Layer, label: string): void
    removeLayer(layer: L.Layer): void
}

export type ControlLayersGroupType = 'baseLayers' | 'overlays'

const key: InjectionKey<ControlLayersContext> = Symbol('hooks/controlLayersContext')

export function setupControlLayersContext(
    control: Readonly<Ref<L.Control.Layers>>,
    group: ControlLayersGroupType
) {
    const { map } = useMapContext()

    let lastBaseLayer: L.Layer | undefined
    onUnmounted(() => {
        lastBaseLayer = undefined
    })

    const ctx: ControlLayersContext = {
        get control() {
            return control.value
        },
        addLayer: (x, y) => {
            if (group === 'baseLayers') {
                x.remove()
                control.value.addBaseLayer(x, y)
                lastBaseLayer = x
                nextTick(() => {
                    if (lastBaseLayer === x) {
                        x.addTo(map)
                    }
                })
            } else {
                control.value.addOverlay(x, y)
                x.addTo(map)
            }
        },
        removeLayer: (x) => control.value.removeLayer(x)
    }

    provide(key, ctx)
    return ctx
}

export function useControlLayersContext() {
    const result = inject(key, null)
    return result
}
