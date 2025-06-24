import { defineComponent, watch, type PropType, type SlotsType } from 'vue'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, mergeOptions, type LLayerSlots } from '../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../types'


export const circleProps = {
    location: {
        type: [Object, Array] as PropType<L.LatLngExpression>,
        required: true as const,
    },
    radius: {
        type: Number,
        required: true as const,
    },
    ...defineLayerProps<L.CircleOptions>(),
}
export type CircleProps = ComponentPublicProps<typeof circleProps>

export const circleEmits = defineLifecycleEmits<L.Circle>()
export type CircleEmits = ComponentPublicEmits<typeof circleEmits>

export type CircleSlots = LLayerSlots<L.Circle>

export const LCircle = defineComponent({
    name: __component_name__,
    props: circleProps,
    emits: circleEmits,
    slots: {} as SlotsType<CircleSlots>,
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
            layer.value?.setRadius(nv)
        )

        return () => {}
    },
})
