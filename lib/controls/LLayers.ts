import { defineComponent, Fragment, h, toRefs, type PropType, type SlotsType } from 'vue'
import { setupLayersControlContext, type LayersControlTargetType } from '../hooks/layersControlContext'
import { defineControl, defineLayerProps, L } from '../leaflet'
import type { ComponentPublicProps, LControlContext } from '../types'

const name = __component_name__

function createGroupComponent(targetType: LayersControlTargetType) {
    return defineComponent({
        name: `${name}\$${targetType}`,
        props: {
            control: {
                type: Object as PropType<L.Control.Layers>,
                required: true,
            }
        },
        setup(props, { slots }) {
            const { control } = toRefs(props)
            setupLayersControlContext(control, targetType)
            return () => slots.default?.()
        }
    })
}

const BaseLayers = createGroupComponent('baseLayers')
const Overlays = createGroupComponent('overlays')

export const layersProps = defineLayerProps<L.Control.LayersOptions>()
export type LayersProps = ComponentPublicProps<typeof layersProps>

export type LayersSlots = {
    default?: (ctx: LControlContext<L.Control.Layers>) => any
    baseLayers?: (ctx: LControlContext<L.Control.Layers>) => any
}

export const LLayers = defineComponent({
    name,
    props: layersProps,
    slots: {} as SlotsType<LayersSlots>,
    setup(props, context) {
        const { control: ctrl, ctx } = defineControl(
            (options) => {
                return L.control.layers({}, {}, options)
            },
            context,
            props
        )

        return () => ctrl.value != null
            ? h(Fragment, [
                h(BaseLayers, { control: ctrl.value }, {
                    default: () => context.slots.baseLayers?.(ctx)
                }),
                h(Overlays, { control: ctrl.value }, {
                    default: () => context.slots.default?.(ctx)
                }),
            ])
            : undefined
    }
})
