import { defineComponent, watch, type PropType } from 'vue'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

export const LMarker = defineComponent({
    name: __component_name__,
    props: {
        latLng: {
            type: [Object, Array] as PropType<L.LatLngExpression>,
            required: true,
        },
       ...defineLayerProps<L.MarkerOptions>(),
    },
    emits: defineLayerEmits<L.Marker>(),
    slots: defineLayerSlots<L.Marker>(),
    setup(props, context) {
        const { latLng: initialLatLng } = props
        const { layer } = setupLayer(
            (options) => _L.marker(initialLatLng, options),
            context,
            props
        )

        watch(() => props.latLng, (v) => {
            layer.value?.setLatLng(v)
        })

        return () => void 0
    }
})
