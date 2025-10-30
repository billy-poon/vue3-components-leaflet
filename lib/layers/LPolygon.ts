import { defineComponent, watch, type PropType } from 'vue'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

export const LPolygon = defineComponent({
    name: __component_name__,
    props: {
        latLngs: {
            type: Array as PropType<_L.LatLngExpression[] | _L.LatLngExpression[][] | _L.LatLngExpression[][][]>,
            required: true,
        },
       ...defineLayerProps<L.PolylineOptions>(),
    },
    emits: defineLayerEmits<L.Polygon>(),
    slots: defineLayerSlots<L.Polygon>(),
    setup(props, context) {
        const {
            latLngs: initialLatLngs
        } = props
        const { layer } = setupLayer(
            (options) => _L.polygon(initialLatLngs, options),
            context,
            props
        )

        watch(() => props.latLngs, (v) => {
            layer.value?.setLatLngs(v)
        })

        return () => void 0
    }
})
