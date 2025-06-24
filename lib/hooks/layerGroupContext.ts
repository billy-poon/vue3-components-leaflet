import { inject, provide, type InjectionKey, type ShallowRef } from 'vue'
import type { LMapContext } from '../types'
import { useMapContext } from './mapContext'

type LayerGroupContext = {
    mapCtx: LMapContext
    readonly layerGroup: L.LayerGroup
}
const key: InjectionKey<LayerGroupContext>
    = Symbol('@vue3-components/leaflet:hooks/layerGroupContext')

export function setupLayerGroupContext(layerGroup: Readonly<ShallowRef<L.LayerGroup>>) {
    const ctx: LayerGroupContext = {
        mapCtx: useMapContext(),
        get layerGroup() { return layerGroup.value }
    }

    provide(key, ctx)
}


export function useLayerGroupContext() {
    const result = inject(key, null)
    return result
}
