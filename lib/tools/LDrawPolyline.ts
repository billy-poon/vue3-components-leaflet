import { computed, defineComponent, Fragment, h, onBeforeUnmount, reactive, shallowReadonly, watch, watchEffect, type PropType, type SlotsType } from 'vue'
import { useMapContext } from '../hooks/mapContext'
import { LPolygon, LPolyline } from '../layers'
import { validateEmit } from '../utils/emits'
import { createKeyboardShortcuts } from '../utils/misc'
import './LDrawPolyline.scss'

type Points = L.LatLng[]
type LDrawPolylineState = {
    active: boolean
    points: Points
    previewPoint: L.LatLng | null
}

export const LDrawPolyline = defineComponent({
    name: __component_name__,
    props: {
        cursor: {
            type: String,
            default: 'crosshair'
        },
        /** preview on mousemove */
        preview: Boolean,
        options: Object as PropType<L.PolylineOptions>,
        polygon: Boolean
    },
    emits: {
        start: validateEmit(),
        change: validateEmit<[val: Points]>(),
        commit: validateEmit<[val: Points]>(),
        abort: validateEmit(),
        stop: validateEmit(),
    },
    slots: {} as SlotsType<{
        default?: (state: LDrawPolylineState) => any,
        visual?: (points: Points) => any
    }>,
    setup(props, { attrs, slots, emit }) {
        const state = reactive<LDrawPolylineState>({
            active: false,
            points: [],
            previewPoint: null,
        })

        const previewPoints = computed(() => {
            const { points, previewPoint } = state

            const result = [...points]
            if (previewPoint != null) {
                result.push(previewPoint)
            }

            return result
        })
        watch(previewPoints, (v) => {
            emit('change', v)
        })

        function start() {
            state.previewPoint = null
            state.points = []
            state.active = true

            emit('start')
        }

        function stop(commit = false) {
            try {
                if (commit) {
                    const result = [...state.points]
                    if (result.length > 0) {
                        // keep points after committed
                        return emit('commit', result)
                    }
                }

                // clean points on abort
                state.points = []
                emit('abort')
            } finally {
                state.previewPoint = null
                state.active = false
                emit('stop')
            }
        }
        onBeforeUnmount(() => {
            state.active && stop()
        })

        const { map, el: mapEl } = useMapContext()
        watchEffect((onCleanup) => {
            if (!state.active) return

            function handleClick(e: L.LeafletMouseEvent) {
                state.points.push(e.latlng)
            }

            function handleMousemove(e: L.LeafletMouseEvent) {
                state.previewPoint = e.latlng
            }

            function handleDblclick(e: MouseEvent) {
                e.preventDefault()
                e.stopPropagation()
                stop(true)
            }

            const handleKeydown = createKeyboardShortcuts({
                stop: true,
                prevent: true,
                'Ctrl+KeyZ': () => {
                    state.points.splice(state.points.length - 1)
                },
                'Escape': () => {
                    stop()
                }
            })

            const eventOptions: EventListenerOptions = { capture: true }
            mapEl.addEventListener('dblclick', handleDblclick, eventOptions)
            document.addEventListener('keydown', handleKeydown, eventOptions)

            const cursor = mapEl.style.cursor
            mapEl.style.cursor = props.cursor

            const { preview } = props
            preview && map.addEventListener('mousemove', handleMousemove)
            map.on('click', handleClick)

            onCleanup(() => {
                map.off('click', handleClick)
                preview && map.off('mousemove', handleMousemove)

                mapEl.style.cursor = cursor

                document.removeEventListener('keydown', handleKeydown, eventOptions)
                mapEl.removeEventListener('dblclick', handleDblclick, eventOptions)
            })
        })

        function handleToggle(e: MouseEvent) {
            e.preventDefault()
            e.stopPropagation()

            if (state.active) {
                stop()
            } else {
                start()
            }
        }

        function renderVisual(points: Points) {
            if (slots.visual != null) {
                return slots.visual(points)
            }

            return h(props.polygon ? LPolygon : LPolyline,
                {
                    latLngs: points,
                    initialOptions: {
                        ...props.options,
                        interactive: false,
                    }
                }
            )
        }

        return () => h(Fragment, [
            h('a',
                {
                    href: '#',
                    class: [
                        'l-draw-polyline-icon',
                        {
                            'l-draw-polyline-icon--active': state.active
                        }
                    ],
                    ...attrs,
                    onClick: handleToggle,
                },
                slots.default?.(shallowReadonly(state)) ?? '🔶'
            ),
            previewPoints.value.length > 0
                ? renderVisual(previewPoints.value)
                : undefined
        ])
    }
})
