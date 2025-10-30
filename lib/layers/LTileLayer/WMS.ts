import { defineComponent, watch } from 'vue'
import { _L } from '../../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../../utils/layer'

export const LTileLayerWMS = defineComponent({
    name: __component_name__,
    props: {
        url: {
            type: String,
            required: true,
        },
        layers: String,
       ...defineLayerProps<L.WMSOptions>(),
    },
    emits: defineLayerEmits<L.TileLayer.WMS>(),
    slots: defineLayerSlots<L.TileLayer.WMS>(),
    setup(props, context) {
        const {
            url: initialUrl,
            layers: initialLayers,
        } = props
        const { layer } = setupLayer(
            (options) => _L.tileLayer.wms(initialUrl, {
                layers: initialLayers,
                ...options
            }),
            context,
            props
        )

        watch(() => props.url, (v) => {
            layer.value?.setUrl(v)
        })

        watch(() => props.layers, (v) => {
            v != null && layer.value?.setParams({ layers: v })
        })

        return () => void 0
    }
})
