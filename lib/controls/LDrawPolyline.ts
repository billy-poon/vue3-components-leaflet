import { defineComponent, h, onBeforeUnmount, shallowRef, watchEffect, type SlotsType } from 'vue'
import { useMapContext } from '../hooks/mapContext'
import type { ComponentPublicEmits, ComponentPublicProps, LControlContext } from '../types'
import { LControl } from './LControl'
import './LDrawPolyline.css'

export const drawPolylineProps = {
    cursor: {
        type: String,
        default: 'crosshair'
    },
    preview: Boolean,
}
export type DrawPolylineProps = ComponentPublicProps<typeof drawPolylineProps>

type Points = L.LatLng[]
export const drawPolylineEmits = {
    start: () => true,
    abort: () => true,
    update: (val: Points) => true,
    commit: (val: Points) => true,
    end: (val: Points) => true,
}
export type DrawPolylineEmits = ComponentPublicEmits<typeof drawPolylineEmits>

export type DrawPolylineSlotContext = LControlContext & {
    drawing: boolean
}
export type DrawPolylineSlots = {
    default?: (ctx: DrawPolylineSlotContext) => any
}

export const LDrawPolyline = defineComponent({
    name: __component_name__,
    props: drawPolylineProps,
    emits: drawPolylineEmits,
    slots: {} as SlotsType<DrawPolylineSlots>,
    setup(props, { attrs, emit, slots }) {
        const drawing = shallowRef(false)
        onBeforeUnmount(() => drawing.value = false)

        const abort = () => {
            drawing.value = false
            emit('abort')
        }
        const update = (val: Points) => {
            emit('update', [...val])
        }
        const commit = (val: Points) => {
            drawing.value = false
            emit('commit', [...val])
        }

        const mapCtx = useMapContext()
        watchEffect((onCleanup) => {
            const val = drawing.value
            if (!val) return

            const points: Points = []
            function handleClick(e: L.LeafletMouseEvent) {
                points.push(e.latlng)
                update(points)
            }

            function handleMousemove(e: L.LeafletMouseEvent) {
                update([...points, e.latlng])
            }

            function handleDblclick(e: MouseEvent) {
                e.preventDefault()
                e.stopPropagation()
                commit(points)
            }

            function handleKeydown(e: KeyboardEvent) {
                if (e.shiftKey) return

                if (e.ctrlKey) {
                    if (e.code !== 'KeyZ') return
                    points.splice(points.length - 1)
                    update(points)
                } else if (e.code === 'Escape') {
                    abort()
                } else {
                    return
                }

                e.preventDefault()
                e.stopPropagation()
            }

            const { map, mapEl, onMousemove: registerMousemove } = mapCtx
            const eventOptions: EventListenerOptions = { capture: true }

            map.on('click', handleClick)
            mapEl.addEventListener('dblclick', handleDblclick, eventOptions)
            document.addEventListener('keydown', handleKeydown, eventOptions)

            const cursor = mapEl.style.cursor
            mapEl.style.cursor = props.cursor

            const offMousemove = props.preview
                ? registerMousemove(handleMousemove)
                : undefined

            emit('start')

            onCleanup(() => {
                offMousemove?.()
                mapEl.style.cursor = cursor

                document.removeEventListener('keydown', handleKeydown, eventOptions)
                mapEl.removeEventListener('dblclick', handleDblclick, eventOptions)
                map.off('click', handleClick)

                emit('end', points)
            })
        })

        function onToggle(e: MouseEvent) {
            e.preventDefault()
            e.stopPropagation()

            if (drawing.value) {
                abort()
            } else {
                drawing.value = true
            }
        }

        function defaultContent() {
            return '✏️'
        }

        return () => h(LControl,
            { ...attrs },
            {
                default: (ctx: LControlContext) => h('a',
                    { href: '#', onClick: onToggle },
                    (slots.default ?? defaultContent)({
                        ...ctx,
                        drawing: drawing.value
                    })
                )
            }
        )
    }
})
