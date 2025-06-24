import { defineComponent, watch, type PropType, type SlotsType } from 'vue'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, mergeOptions, type LLayerSlots } from '../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../types'


export const circleMarkerProps = {
    location: {
        type: [Object, Array] as PropType<L.LatLngExpression>,
        required: true as const,
    },
    radius: Number,
    ...defineLayerProps<L.CircleMarkerOptions>()
}
export type CircleMarkerProps = ComponentPublicProps<typeof circleMarkerProps>

export const circleMarkerEmits = defineLifecycleEmits<L.CircleMarker>()
export type CircleMarkerEmits = ComponentPublicEmits<typeof circleMarkerEmits>

export type CircleMarkerSlots = LLayerSlots<L.CircleMarker>

export const LCircleMarker = defineComponent({
    name: __component_name__,
    props: circleMarkerProps,
    emits: circleMarkerEmits,
    slots: {} as SlotsType<CircleMarkerSlots>,
    setup(props, context) {
        const {
            location: defaultLocation,
            radius: defaultRadius,
        } = props

        const { layer } = defineLayer(
            (options) => {
                return L.circle(defaultLocation, mergeOptions(options, {
                    radius: defaultRadius
                }))
            },
            context,
            props,
        )

        watch(() => props.location, (nv) =>
            layer.value?.setLatLng(nv)
        )

        watch(() => props.radius, (nv) =>
            nv != null && layer.value?.setRadius(nv)
        )

        return () => {}
    },
})
