import { defineComponent, h, reactive, shallowRef, watch, type PropType, type ShallowRef, type SlotsType } from 'vue'
import { useEventAttrs } from './hooks/eventAttrs'
import { setupMapContext } from './hooks/mapContext'
import { _L } from './leaflet'
import './LMap.scss'
import { defineLifecycleEmits } from './utils/emits'
import { throttle } from './utils/misc'
import { defineObjectProps, setupObject } from './utils/object'

export type LMapContext = {
    el: HTMLElement
    map: L.Map
}

export const LMap = defineComponent({
    name: __component_name__,
    inheritAttrs: false,
    props: {
        zoom: Number,
        center: [Object, Array] as PropType<L.LatLngExpression>,
        bounds: [Object, Array] as PropType<L.LatLngBoundsExpression>,
        fitBoundsOptions: Object as PropType<L.FitBoundsOptions>,
        ...defineObjectProps<L.MapOptions>(),
    },
    emits: defineLifecycleEmits<LMapContext>(),
    slots: {} as SlotsType<{
        default?: (map: L.Map) => any
    }>,
    setup(props, { emit, slots }) {
        const {
            zoom: initialZoom,
            center: initialCenter,
            bounds: initialBounds,
        } = props
        const el = shallowRef(null) as ShallowRef<HTMLElement | null>
        const { obj: map, watchValueEffect } = setupObject(
            (options) => {
                const val = el.value
                if (val == null) {
                    return null
                }

                const opts = {
                    zoom: initialZoom,
                    center: initialCenter,
                    ...options
                }
                const result = _L.map(val, opts)
                if (initialBounds != null) {
                    result.fitBounds(initialBounds)
                }

                return result
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

        type MapView = {
            zoom?: number
            center?: L.LatLngExpression
            bounds?: L.LatLngBoundsExpression
        }
        const setView = throttle((view: MapView, options?: L.FitBoundsOptions) => {
            const val = map.value
            if (val == null) return;

            const { zoom, center, bounds } = view
            options = options ?? props.fitBoundsOptions
            if (bounds != null) {
                val.fitBounds(bounds, options)
            } else if (center != null) {
                val.setView(center, zoom, options)
            } else if (zoom != null) {
                val.setZoom(zoom, options)
            }
        })

        watch(
            () => {
                const { zoom, center, bounds } = props
                return { zoom, center, bounds }
            },
            (val) => {
                setView(val)
            }
        )

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
