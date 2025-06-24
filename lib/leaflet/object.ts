import { type PropType, shallowReadonly, shallowRef, watchEffect } from 'vue'
import type { ComponentProps, Factory } from '../types'
import { mergeOptions } from './utils'

type LObject = {
    remove(): any
}

export function defineObjectProps<T>() {
    return {
        options: Object as PropType<T>,
        defaultOptions: Object as PropType<T>,
    }
}

export type LObjectProps<T = any> = ComponentProps<ReturnType<typeof defineObjectProps<T>>>

export function defineObject<T extends LObject, P extends LObjectProps>(
    factory: Factory<T | null, [options: P['options']]>,
    props: P
) {
    const obj = shallowRef<T>()

    // `defaultOptions` is not reactive
    const { defaultOptions } = props

    async function createObject() {
        type O = Exclude<P['options'], undefined>

        const options = defaultOptions != null
            ? mergeOptions({ ...defaultOptions } as O, props.options ?? {} )
            : props.options

        const val = await factory(options)
        obj.value = val ?? undefined

        return val
    }

    async function destroyObject() {
        const val = obj.value
        if (val != null) {
            obj.value = undefined
            await val.remove()
        }
    }

    watchEffect((onCleanup) => {
        createObject()

        onCleanup(() => {
            destroyObject()
        })
    })

    return { obj: shallowReadonly(obj) }
}
