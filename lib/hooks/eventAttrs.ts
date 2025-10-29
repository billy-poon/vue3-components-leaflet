import { camelize, useAttrs } from 'vue'
import type { Fn } from '../types'

type EventAttrs = Record<string, Fn>

export function useEventAttrs() {
    const data = useAttrs()

    const attrs: typeof data = {}
    const eventAttrs: EventAttrs = {}
    Object.entries(data)
        .forEach(([k, v]) => {
            if (typeof v === 'function' && /^on\w/.test(k)) {
                const event = camelize(k.slice(2)).toLowerCase()
                eventAttrs[event] = v as Fn
            } else {
                attrs[k] = v
            }
        })

    return { attrs, eventAttrs }
}
