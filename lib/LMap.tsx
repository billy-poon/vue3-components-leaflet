import { defineComponent, toRef, watchEffect, type PropType } from 'vue'
import { useEventAttrs } from './hooks/eventAttrs'
import { setupMapContext } from './hooks/mapContext'
import { _L } from './leaflet'
import './LMap.scss'
import type { Fn } from './types'

export type LMapContext = {
    el: HTMLElement
    map: L.Map
}


export const LMap = defineComponent({
    inheritAttrs: false,
    props: {
        options: Object as PropType<L.MapOptions>,
        initialOptions: Object as PropType<L.MapOptions>,
    },
    emits: {
        ready: null as unknown as Fn<void, [ctx: LMapContext]>,
        remove: null as unknown as Fn<void, [ctx: LMapContext]>,
    },
    setup(props, { emit, slots }) {
        const state = setupMapContext()

        const { attrs, eventAttrs } = useEventAttrs()

        const { initialOptions } = props
        watchEffect((onCleanup) => {
            const { el } = state
            if (el == null) return;

            const map = _L.map(el, props.options ?? initialOptions)

            state.map = map
            map.on(eventAttrs)
            emit('ready', { el, map })
            onCleanup(() => {
                state.map = null
                map.off(eventAttrs).remove()
                emit('remove', { el, map })
            })
        })

        const refEl = toRef(state, 'el')

        return () => (
            <div ref={refEl} { ...{ class: 'l-map', ...attrs } }>
                { state.map != null ? slots.default?.() : void 0 }
            </div>
        )
    }
})
