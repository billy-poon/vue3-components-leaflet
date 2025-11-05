import { defineComponent, Fragment, h, toRef, type PropType, type SlotsType } from 'vue'
import { setupControlLayersContext, type ControlLayersGroupType } from '../hooks/controlLayersContext'
import { _L } from '../leaflet'
import { defineControlProps, setupControl } from '../utils/control'

const name = __component_name__

function defineGroupComponent(group: ControlLayersGroupType) {
    return defineComponent({
        name: `${name}#${group}`,
        props: {
            control: {
                type: Object as PropType<L.Control.Layers>,
                required: true
            }
        },
        setup(props, { slots }) {
            const ctrl = toRef(props, 'control')
            setupControlLayersContext(ctrl, group)

            return () => slots.default?.()
        }
    })
}

const Overlays = defineGroupComponent('overlays')
const BaseLayers = defineGroupComponent('baseLayers')

export type LControlLayerSlots = {
    default?: () => unknown
    baseLayers?: () => unknown
}

export const LControlLayers = defineComponent({
    name,
    props: defineControlProps<L.Control.LayersOptions>(),
    slots: {} as SlotsType<LControlLayerSlots>,
    setup(props, context) {
        const { control: ctrl } = setupControl(
            (options) => _L.control.layers({}, {}, options),
            context,
            props
        )

        const { slots } = context
        return () => {
            const val = ctrl.value
            if (val == null) return;

            return h(Fragment, [
                h(BaseLayers, { control: val }, {
                    default: () => slots.baseLayers?.()
                }),
                h(Overlays, { control: val }, {
                    default: () => slots.default?.()
                }),
            ])
        }
    }
})
