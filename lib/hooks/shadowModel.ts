import { shallowRef, watch, type ShallowRef } from 'vue'

type OnChanged<T> = (nv: T, ov: T) => void
type Options<T> = {
    onPropChanged?: OnChanged<T>
    onModelChanged?: OnChanged<T>
    initialValue?: T
}

export function useShadowModel<
    P extends Record<string, any>,
    K extends Exclude<keyof P, symbol>,
    E extends (...args: any) => any
>(props: P, key: K, emit: E, options?: Options<P[K]>): ShallowRef<P[K]> {
    const {
        onPropChanged = (nv: P[K]) => { model.value = nv },
        onModelChanged = (nv: P[K]) => { emit(`update:${key}`, nv) },
        initialValue,
    } = options ?? {}

    const model = shallowRef(props[key] ?? initialValue)

    watch(() => props[key], (nv, ov) => {
        if (nv !== model.value) {
            onPropChanged(nv, ov)
        }
    })

    watch(model, (nv, ov) => {
        if (nv !== props[key]) {
            onModelChanged(nv, ov)
        }
    })

    return model as any
}
