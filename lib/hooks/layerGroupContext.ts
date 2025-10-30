import { inject, provide, type InjectionKey, type Ref } from 'vue'

export type LayersGroupContext = Readonly<{
    group: L.LayerGroup
    addLayer(layer: L.Layer): void
    removeLayer(layer: L.Layer): void
}>

const key: InjectionKey<LayersGroupContext> = Symbol('hooks/layersGroupContext')

export function setupLayersGroupContext(
    group: Readonly<Ref<L.LayerGroup>>
) {
    const ctx: LayersGroupContext = {
        get group() {
            return group.value
        },
        addLayer: x => {
            group.value.addLayer(x)
        },
        removeLayer: x => {
            group.value.removeLayer(x)
        }
    }

    provide(key, ctx)
}

export function useLayersGroupContext() {
    const result = inject(key, null)
    return result
}
