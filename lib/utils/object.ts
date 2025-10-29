import { shallowRef, watchEffect, type ExtractPropTypes, type PropType, type ShallowRef } from 'vue'
import type { Factory } from '../types'

export interface LeafletObject {
    remove(): void
}

export function defineObjectProps<O extends object>() {
    return {
        options: Object as PropType<O>,
        initialOptions: Object as PropType<O>
    }
}

type LObjectProps = ExtractPropTypes<ReturnType<typeof defineObjectProps<any>>>

export type WatchValueEffect<T> = (val: T) => void | (() => void)

export function setupObject<
    T extends LeafletObject,
    P extends LObjectProps
>(
    factory: Factory<T | null, [options: P['options']]>,
    props: P
) {
    const { initialOptions } = props

    const obj = shallowRef(null) as ShallowRef<T | null>
    watchEffect(() => {
        obj.value = factory(props.options ?? initialOptions)
    })

    function watchValueEffect(effect: WatchValueEffect<T>) {
        watchEffect((onCleanup) => {
            const val = obj.value
            if (val == null) return;

            const clean = effect(val)
            onCleanup(() => {
                if (typeof clean === 'function') {
                    clean()
                }
            })
        })
    }

    watchValueEffect((val) => {
        // val.addTo(...)
        // layers may added to
        // `Layers` control or
        // `LayerGroup` layer
        // remove it here only
        return () => val.remove()
    })

    return { obj, watchValueEffect }
}
