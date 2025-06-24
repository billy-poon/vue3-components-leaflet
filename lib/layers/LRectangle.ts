import { defineComponent, watch, type PropType, type SlotsType } from 'vue'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, type LLayerSlots } from '../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../types'


export const rectangleProps = {
    bounds: {
        type: [Object, Array] as PropType<L.LatLngBoundsExpression>,
        required: true as const,
    },
    ...defineLayerProps<L.PolylineOptions>()
}
export type RectangleProps = ComponentPublicProps<typeof rectangleProps>

export const rectangleEmits = defineLifecycleEmits<L.Rectangle>()
export type RectangleEmits = ComponentPublicEmits<typeof rectangleEmits>

export type RectangleSlots = LLayerSlots<L.Rectangle>

export const LRectangle = defineComponent({
    name: __component_name__,
    props: rectangleProps,
    emits: rectangleEmits,
    slots: {} as SlotsType<RectangleSlots>,
    setup(props, context) {
        const {
            bounds: defaultBounds
        } = props

        const { layer } = defineLayer(
            (options) => {
                return L.rectangle(defaultBounds, options)
            },
            context,
            props,
        )


        watch(() => props.bounds, (nv) =>
            layer.value?.setBounds(nv)
        )

        return () => undefined
    },
})
