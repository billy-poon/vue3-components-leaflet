import { inject, provide, shallowReadonly, type InjectionKey, type ShallowReactive } from 'vue'
import type { LMapContext } from '../LMap'

const key: InjectionKey<LMapContext> = Symbol('hooks/mapContext')

export function setupMapContext(ctx: ShallowReactive<LMapContext>) {
    provide(key, shallowReadonly(ctx))
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
