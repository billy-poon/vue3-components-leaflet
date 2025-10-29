import { defineComponent, reactive, shallowRef, type ShallowRef } from 'vue'
import { useEventAttrs } from './hooks/eventAttrs'
import { setupMapContext } from './hooks/mapContext'
import { _L } from './leaflet'
import './LMap.scss'
import { defineLifecycleEmits } from './utils/emits'
import { defineObjectProps, setupObject } from './utils/object'

export type LMapContext = {
    el: HTMLElement
    map: L.Map
}

export const LMap = defineComponent({
    inheritAttrs: false,
    props: defineObjectProps<L.MapOptions>(),
    emits: defineLifecycleEmits<LMapContext>(),
    setup(props, { emit, slots }) {
        const el = shallowRef(null) as ShallowRef<HTMLElement | null>
        const { obj: map, watchValueEffect } = setupObject(
            (options) => {
                const val = el.value
                return val != null
                    ? _L.map(val, options)
                    : null
            },
            props
        )

        const state = reactive({ el, map })
        setupMapContext(state as any)

        const { attrs, eventAttrs } = useEventAttrs()
        watchValueEffect((map) => {
            const ctx = { el: el.value!, map }

            map.on(eventAttrs)
            emit('ready', ctx)
            return () => {
                map.off(eventAttrs)
                emit('remove', ctx)
            }
        })

        return () => (
            // `{ class: 'l-map', ...attrs }` makes
            // the `class` attribute over-writable
            <div ref={el} { ...{ class: 'l-map', ...attrs } }>
                { state.map != null ? slots.default?.() : void 0 }
            </div>
        )
    }
})
