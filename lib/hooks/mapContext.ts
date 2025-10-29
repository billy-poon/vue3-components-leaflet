import { inject, provide, shallowReactive, shallowReadonly, type InjectionKey } from 'vue'
import type { LMapContext } from '../LMap'

const key: InjectionKey<LMapContext> = Symbol('hooks/mapContext')

export function setupMapContext() {
    const state = shallowReactive({
        el: null as HTMLElement | null,
        map: null as L.Map | null
    })

    provide(key, shallowReadonly(state) as LMapContext)

    return state
}

export function useMapContext(): LMapContext
export function useMapContext(required: false): LMapContext | null
export function useMapContext(required = true) {
    const result = inject(key, null)
    if (result?.map == null) {
        if (required) {
            throw new Error('MapContext is not ready.')
        }
    }

    return result
}
