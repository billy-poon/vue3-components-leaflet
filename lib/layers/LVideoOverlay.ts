import { defineComponent, watch, type PropType } from 'vue'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

export const LVideoOverlay = defineComponent({
    name: __component_name__,
    props: {
        url: {
            type: String,
            required: true,
        },
        bounds: {
            type: [Object, Array] as PropType<L.LatLngBoundsExpression>,
            required: true,
        },
       ...defineLayerProps<L.VideoOverlayOptions>(),
    },
    emits: defineLayerEmits<L.VideoOverlay>(),
    slots: defineLayerSlots<L.VideoOverlay>(),
    setup(props, context) {
        const {
            url: initialUrl,
            bounds: initialBounds,
        } = props
        const { layer } = setupLayer(
            (options) => _L.videoOverlay(initialUrl, initialBounds, options),
            context,
            props
        )

        watch(() => props.url, (v) => {
            layer.value?.setUrl(v)
        })

        watch(() => props.bounds, (v) => {
            const val = v instanceof _L.LatLngBounds
                ? v : _L.latLngBounds(v)
            layer.value?.setBounds(val)
        })

        return () => void 0
    }
})
