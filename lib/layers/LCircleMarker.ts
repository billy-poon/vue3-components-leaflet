import { defineComponent, watch, type PropType } from 'vue'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

export const LCircleMarker = defineComponent({
    name: __component_name__,
    props: {
        latLng: {
            type: [Object, Array] as PropType<L.LatLngExpression>,
            required: true,
        },
        /** Radius of the circle marker, in pixels */
        radius: Number,
       ...defineLayerProps<L.CircleMarkerOptions>(),
    },
    emits: defineLayerEmits<L.CircleMarker>(),
    slots: defineLayerSlots<L.CircleMarker>(),
    setup(props, context) {
        const {
            latLng: initialLatLng,
            radius: initialRadius,
        } = props
        const { layer } = setupLayer(
            (options) => _L.circleMarker(initialLatLng,
                initialRadius != null
                    ? { radius: initialRadius, ...options }
                    : options
            ),
            context,
            props
        )

        watch(() => props.latLng, (v) => {
            layer.value?.setLatLng(v)
        })

        watch(() => props.radius, (v) => {
            v != null && layer.value?.setRadius(v)
        })

        return () => void 0
    }
})
