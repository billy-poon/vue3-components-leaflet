import { defineComponent, h, shallowRef, watchEffect, type PropType, type SlotsType } from 'vue'
import { useMapContext } from '../hooks/mapContext'
import type { ComponentPublicProps, LControlContext } from '../types'
import { LControl } from './LControl'

const formats = ['latLng', 'lngLat', 'xy', 'yx'] as const
export type FormatType = typeof formats[number]

const formatMap: Record<FormatType, string> = {
    'lngLat': '[{lng},{lat}]',
    'latLng': '[{lat},{lng}]',
    'xy': '[{x},{y}]',
    'yx': '[{y},{x}]',
}

export type Location = {
    x: number
    y: number
    lat: number
    lng: number
}

function formatPosition(location: Location, format: FormatType) {
    const displayValue = Object.entries(location)
        .reduce(
            (res, [k, v]) => {
                const val = ['lng', 'lat'].includes(k)
                    ? v.toFixed(6)
                    : v + ''
                res[k] = val
                return res
            },
            {} as Record<string, string>
        )

    const formatString = formatMap[format] ?? format
    return formatString.replace(/\{(\w+)\}/g, (val, key) => {
        return displayValue[key] ?? val
    })
}

export const mouseLocationProps = {
    format: {
        type: String as PropType<FormatType>,
        default: formats[0],
    },
    freezable: Boolean
}
export type MouseLocationProps = ComponentPublicProps<typeof mouseLocationProps>

export type MouseLocationSlotContext = LControlContext & {
    location: Location
    freezed: boolean
}
export type MouseLocationSlots = {
    default?: (ctx: MouseLocationSlotContext) => any
}

export const LMouseLocation = defineComponent({
    name: __component_name__,
    props: mouseLocationProps,
    slots: {} as SlotsType<MouseLocationSlots>,
    setup(props, { attrs, slots }) {
        const mapCtx = useMapContext()
        const freezed = shallowRef(false)

        const location = shallowRef<Location>()
        function setLocation(e: L.LeafletMouseEvent) {
            // cSpell: ignore latlng
            const { latlng, containerPoint } = e
            location.value = {
                ...containerPoint,
                ...latlng
            }
        }

        function onMousemove(e: L.LeafletMouseEvent) {
            if (!freezed.value) {
                setLocation(e)
            }
        }

        const eventOptions: EventListenerOptions = { capture: true }
        function onClick(e: L.LeafletMouseEvent) {
            if (!freezed.value) {
                freezed.value = true
                document.addEventListener('keydown', onKeydown, eventOptions)

            }
            setLocation(e)
        }

        function onKeydown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', onKeydown, eventOptions)
                freezed.value = false
                e.stopPropagation()
                e.preventDefault()
            }
        }

        watchEffect((onCleanup) => {
            const { map, onMousemove: registerMousemove } = mapCtx
            const { freezable } = props

            const offMousemove = registerMousemove(onMousemove)
            if (freezable) {
                map.on('click', onClick)
            }

            onCleanup(() => {
                offMousemove()
                if (freezable) {
                    map.off('click', onClick)
                }
            })
        })

        function defaultContent(ctx: MouseLocationSlotContext) {
            return formatPosition(ctx.location, props.format)
        }

        return () => {
            const locationVal = location.value
            return locationVal != null
                ? h(LControl, { selectable: true, ...attrs }, {
                    default: (ctx: LControlContext) => (slots.default ?? defaultContent)({
                        ...ctx,
                        location: locationVal,
                        freezed: freezed.value
                    })
                })
                : undefined
        }
    }
})
