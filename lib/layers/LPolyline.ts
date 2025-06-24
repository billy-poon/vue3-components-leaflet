import { defineComponent, watch, type PropType, type SlotsType } from 'vue'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, mergeOptions, type LLayerSlots } from '../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../types'

export type Polyline = L.Polyline<any>
export type PolylinePoints = L.LatLngExpression[] | L.LatLngExpression[]

export function definePolylineProps() {
    return {
        points: {
            type: Array as PropType<PolylinePoints>,
            required: true as const,
        },
        style: Object as PropType<L.PathOptions>,
        ...defineLayerProps<L.PolylineOptions>()
        }
}

export const polylineProps = definePolylineProps()
export type PolylineProps = ComponentPublicProps<typeof polylineProps>

export const polylineEmits = defineLifecycleEmits<Polyline>()
export type PolylineEmits = ComponentPublicEmits<typeof polylineEmits>

export type PolylineSlots = LLayerSlots<Polyline>

export const LPolyline = defineComponent({
    name: __component_name__,
    props: polylineProps,
    emits: polylineEmits,
    slots: {} as SlotsType<PolylineSlots>,
    setup(props, context) {
        const {
            points: defaultPoints,
            style: defaultStyle,
        } = props

        const { layer } = defineLayer(
            (options) => {
                return L.polyline(defaultPoints, defaultStyle != null
                    ? mergeOptions(options, defaultStyle)
                    : options
                )
            },
            context,
            props,
        )

        watch(() => props.points, (nv) =>
            nv != null && layer.value?.setLatLngs(nv)
        )

        watch(() => props.style, (nv) =>
            nv != null && layer.value?.setStyle(nv)
        )

        return () => { }
    }
})
