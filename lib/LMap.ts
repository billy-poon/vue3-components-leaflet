import { defineComponent, h, reactive, shallowRef, type ShallowRef, type SlotsType } from 'vue'
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
    name: __component_name__,
    inheritAttrs: false,
    props: defineObjectProps<L.MapOptions>(),
    emits: defineLifecycleEmits<LMapContext>(),
    slots: {} as SlotsType<{
        default?: (map: L.Map) => any
    }>,
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

        return () => h('div',
            {
                class: 'l-map',
                ...attrs,
                ref: el,
            },
            map.value != null
                ? slots.default?.(map.value)
                : void 0
        )
    }
})
