import { defineComponent } from 'vue'
import { setupLayersGroupContext } from '../hooks/layerGroupContext'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

export const LLayerGroup = defineComponent({
    name: __component_name__,
    props: defineLayerProps<L.LayerOptions>(),
    emits: defineLayerEmits<L.LayerGroup>(),
    slots: defineLayerSlots<L.LayerGroup, {
        default?: () => any
    }>(),
    setup(props, context) {
        const { layer } = setupLayer(
            (options) => _L.layerGroup([], options),
            context,
            props
        )

        setupLayersGroupContext(layer as any)

        return () => context.slots.default?.()
    }
})
