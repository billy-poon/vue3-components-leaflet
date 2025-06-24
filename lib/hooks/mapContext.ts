import { inject, provide, type InjectionKey } from 'vue'
import type { LMapContext } from '../types'

const key: InjectionKey<LMapContext>
    = Symbol('@vue3-components/leaflet:hooks/mapContext')

export function setupMapContext(ctx: LMapContext) {
    provide(key, ctx)
    return ctx
}

export function useMapContext(): LMapContext
export function useMapContext(required: false): LMapContext | null
export function useMapContext(required = true) {
    const result = inject(key, null)
    if (result == null && required) {
        throw new Error('Injection not found: ' + String(key))
    }

    return result
}
