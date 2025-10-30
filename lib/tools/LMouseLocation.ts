import { computed, defineComponent, h, shallowReactive, shallowReadonly, watchEffect, type PropType, type SlotsType } from 'vue'
import { useMapContext } from '../hooks/mapContext'
import { createKeyboardShortcuts } from '../utils/emits'
import './LMouseLocation.scss'

type FormatFn = (val: L.LatLng | null, freezed: boolean) => string

type LMouseLocationState = {
    freezed: boolean
    location: L.LatLng | null
}

const LMouseLocation = defineComponent({
    name: __component_name__,
    props: {
        format: {
            type: [String, Function] as PropType<'latLng' | 'lngLat' | FormatFn>,
            default: 'latLng',
        },
        digits: {
            type: Number,
            default: 6,
        },
        emptyText: {
            type: String,
            default: '...',
        },
        freezable: [Boolean, String],
    },
    slots: {} as SlotsType<{
        default?: (state: LMouseLocationState) => any
    }>,
    setup(props, context) {
        const { map } = useMapContext()

        const state = shallowReactive<LMouseLocationState>({
            freezed: false,
            location: null,
        })

        watchEffect((onCleanup) => {
            const { freezable } = props
            if (!freezable) return

            const shortcut = typeof freezable === 'string'
                ? freezable : 'Space'

            function handleToggle() {
                state.freezed = !state.freezed
            }

            const handleShortcuts = createKeyboardShortcuts({
                stop: true,
                prevent: true,
                [shortcut]: () => handleToggle(),
            })

            function handleKeydown(e: L.LeafletKeyboardEvent) {
                handleShortcuts(e.originalEvent)
            }

            map.on('click', handleToggle)
            map.on('keydown', handleKeydown)
            onCleanup(() => {
                map.off('keydown', handleKeydown)
                map.off('click', handleToggle)
            })
        })

        watchEffect((onCleanup) => {
            if (state.freezed) return

            function handleMousemove(e: L.LeafletMouseEvent) {
                state.location = e.latlng
            }

            map.on('mousemove', handleMousemove)
            onCleanup(() => {
                map.off('mousemove', handleMousemove)
            })
        })

        const displayText = computed(() => {
            const { format } = props
            const { location, freezed } = state
            if (typeof format === 'function') {
                return format(location, freezed)
            }

            if (location == null) {
                return props.emptyText
            }

            let xy = [location.lat, location.lng]
            if (format === 'lngLat') {
                xy = xy.reverse()
            }

            return xy.map(v => v.toFixed(props.digits)).join(',')
        })

        return () => context.slots.default?.(shallowReadonly(state))
            ?? h('div',
                {
                    class: [
                        'l-mouse-location',
                        { 'l-mouse-location--freezed': state.freezed }
                    ]
                },
                displayText.value
            )
    }
})

export default LMouseLocation
