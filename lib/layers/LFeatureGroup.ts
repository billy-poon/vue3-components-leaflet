import { defineComponent } from 'vue'
import { setupLayersGroupContext } from '../hooks/layerGroupContext'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

export const LFeatureGroup = defineComponent({
    name: __component_name__,
    props: {
       ...defineLayerProps<L.LayerOptions>(),
    },
    emits: defineLayerEmits<L.FeatureGroup>(),
    slots: defineLayerSlots<L.FeatureGroup, {
        default?: (layer: L.FeatureGroup) => any
    }>(),
    setup(props, context) {
        const { layer } = setupLayer(
            (options) => _L.featureGroup([], options),
            context,
            props
        )

        setupLayersGroupContext(layer as any)

        return () => context.slots.default?.(layer.value!)
    }
})
