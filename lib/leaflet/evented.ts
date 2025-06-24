import { camelize, type SetupContext } from 'vue'
import type { Factory, Fn } from '../types'
import { defineObject, type LObjectProps } from './object'

const lifecycleEvents = ['init', 'load', 'unload', 'destroy'] as const
export type LifecycleEvent = typeof lifecycleEvents[number]

export type LifecycleEmits<T, R = void> = {
    [K in LifecycleEvent]: (obj: T) => R
}

export function defineLifecycleEmits<T>() {
    const validate = () => true as const
    return lifecycleEvents.reduce(
        (res, x) => (res[x] = validate, res),
        {} as LifecycleEmits<T, true>
    )
}

type Attrs = SetupContext['attrs']
type EventAttrs = Record<string, Fn>
type LEvented = L.Map | L.Layer

// cSpell: ignore evented
export function defineEvented<T extends LEvented, P extends LObjectProps>(
    factory: Factory<T | null, [options: P['options']]>,
    context: SetupContext<LifecycleEmits<T>>,
    props: P,
) {
    const attrs: Attrs = {}
    const eventAttrs: EventAttrs = {}
    Object.entries(context.attrs)
        .forEach(([k, v]) => {
            if (typeof v === 'function' && /^on\w/.test(k)) {
                const event = camelize(k.slice(2)).toLocaleLowerCase()
                eventAttrs[event] = v as Fn
            } else {
                attrs[k] = v
            }
        })

    const { emit } = context

    const result = defineObject(
        async (options) => {
            const val = await factory(options)
            if (val != null) {
                val.on('load', () => emit('load', val))
                val.on('unload', () => emit('unload', val))
                val.on(eventAttrs)

                emit('init', val)
            }

            return val
        },
        props
    )

    return { ...result, attrs }
}
