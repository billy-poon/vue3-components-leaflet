import { defineComponent, watch, type SlotsType } from 'vue'
import { L, defineLayer, defineLifecycleEmits, mergeOptions, type LLayerSlots } from '../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../types'
import { definePolylineProps } from './LPolyline'

export const polygonProps = definePolylineProps()
export type PolygonProps = ComponentPublicProps<typeof polygonProps>

export const polygonEmits = defineLifecycleEmits<L.Polygon>()
export type PolygonEmits = ComponentPublicEmits<typeof polygonEmits>

export type PolygonSlots = LLayerSlots<L.Polygon>

export const LPolygon = defineComponent({
    name: __component_name__,
    props: polygonProps,
    emits: polygonEmits,
    slots: {} as SlotsType<PolygonSlots>,
    setup(props, context) {
        const {
            style: defaultStyle,
            points: defaultPoints,
        } = props

        const { layer } = defineLayer(
            (options) => {
                return L.polygon(defaultPoints, defaultStyle != null
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

        return () => {}
    },
})
