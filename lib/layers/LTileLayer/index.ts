import { defineComponent, watch } from 'vue'
import { _L } from '../../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../../utils/layer'

export const LTileLayer = defineComponent({
    name: __component_name__,
    props: {
        url: {
            type: String,
            required: true,
        },
        ...defineLayerProps<L.TileLayerOptions>(),
    },
    emits: defineLayerEmits<L.TileLayer>(),
    slots: defineLayerSlots<L.TileLayer>(),
    setup(props, context) {
        const { url: initialUrl } = props
        const { layer } = setupLayer(
            (options) => _L.tileLayer(initialUrl, options),
            context,
            props
        )

        watch(() => props.url, (v) => {
            layer.value?.setUrl(v)
        })

        return () => void 0
    }
})
