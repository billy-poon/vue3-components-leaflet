import { defineComponent, watch, type PropType } from 'vue'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

type Polyline = L.Polyline<any>

export const LPolyline = defineComponent({
    name: __component_name__,
    props: {
        latLngs: {
            type: Array as PropType<_L.LatLngExpression[] | _L.LatLngExpression[][]>,
            required: true,
        },
       ...defineLayerProps<L.PolylineOptions>(),
    },
    emits: defineLayerEmits<Polyline>(),
    slots: defineLayerSlots<Polyline>(),
    setup(props, context) {
        const {
            latLngs: initialLatLngs
        } = props
        const { layer } = setupLayer(
            (options) => _L.polyline(initialLatLngs, options),
            context,
            props
        )

        watch(() => props.latLngs, (v) => {
            layer.value?.setLatLngs(v)
        })

        return () => void 0
    }
})
