import { defineComponent, type SlotsType } from 'vue'
import { setupLayerGroupContext } from '../hooks/layerGroupContext'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, type LLayerSlotHandler, type LLayerSlots } from '../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../types'


export const layerGroupProps = defineLayerProps<L.LayerOptions>()
export type LayerGroupProps = ComponentPublicProps<typeof layerGroupProps>

export const layerGroupEmits = defineLifecycleEmits<L.LayerGroup>()
export type LayerGroupEmits = ComponentPublicEmits<typeof layerGroupEmits>

export type LayerGroupSlots = LLayerSlots<L.LayerGroup> & {
    default?: LLayerSlotHandler<L.LayerGroup>
}

export const LLayerGroup = defineComponent({
    name: __component_name__,
    props: layerGroupProps,
    emits: layerGroupEmits,
    slots: {} as SlotsType<LayerGroupSlots>,
    setup(props, context) {
        const { layer, ctx } = defineLayer(
            (options) => {
                return L.layerGroup([], options)
            },
            context,
            props,
        )

        setupLayerGroupContext(layer)

        return () => layer.value != null
            ? context.slots.default?.(ctx)
            : undefined
    },
})
