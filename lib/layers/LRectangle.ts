import { defineComponent, watch, type PropType } from 'vue'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

export const LRectangle = defineComponent({
    name: __component_name__,
    props: {
        bounds: {
            type: [Object, Array] as PropType<L.LatLngBoundsExpression>,
            required: true,
        },
       ...defineLayerProps<L.PolylineOptions>(),
    },
    emits: defineLayerEmits<L.Rectangle>(),
    slots: defineLayerSlots<L.Rectangle>(),
    setup(props, context) {
        const { bounds: initialBounds } = props
        const { layer } = setupLayer(
            (options) => _L.rectangle(initialBounds, options),
            context,
            props
        )

        watch(() => props.bounds, (v) => {
            const val = v instanceof _L.LatLngBounds
                ? v : _L.latLngBounds(v)
            layer.value?.setBounds(val)
        })

        return () => void 0
    }
})
