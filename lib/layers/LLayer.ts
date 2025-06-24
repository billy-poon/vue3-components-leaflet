import { computed, defineComponent, h, shallowRef, watch, type PropType, type SlotsType } from 'vue'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, latLngBounds, type LLayerSlots } from '../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps, LLayerContext } from '../types'


export const layerProps = {
    content: [String, HTMLElement],
    bounds: {
        type: [Object, Array] as PropType<L.LatLngBoundsExpression>,
        required: true as const,
    },
    ...defineLayerProps<L.ImageOverlayOptions>()
}
export type LayerProps = ComponentPublicProps<typeof layerProps>

export const layerEmits = defineLifecycleEmits<L.Layer>()
export type LayerEmits = ComponentPublicEmits<typeof layerEmits>

export type LayerSlotContext = LLayerContext & {
    bounds: L.LatLngBounds
}

export type LayerSlots = LLayerSlots<L.SVGOverlay> & {
    default?: (ctx: LayerSlotContext) => any
}

export const LLayer = defineComponent({
    name: __component_name__,
    props: layerProps,
    emits: layerEmits,
    slots: {} as SlotsType<LayerSlots>,
    setup(props, context) {
        const el = shallowRef<HTMLElement>()

        const bounds = computed(() => latLngBounds(props.bounds))
        const defaultBounds = bounds.value

        const { layer, ctx } = defineLayer<L.SVGOverlay, typeof props>(
            (options) => {
                const { content } = props

                let html: HTMLElement | undefined
                if (content instanceof HTMLElement) {
                    html = content
                } else if (typeof content === 'string') {
                    html = document.createElement('div')
                    html.className = 'l-layer'
                    html.innerHTML = content
                } else if (el.value != null) {
                    html = el.value
                }

                if (html == null) {
                    return null
                }

                el.value?.remove()
                return L.svgOverlay(html as any, defaultBounds, options)
            },
            context,
            props,
        )

        watch(bounds, (nv) =>
            layer.value?.setBounds(nv)
        )

        return () => props.content == null
            ? h('div',
                { class: 'l-layer', ...context.attrs, ref: el },
                context.slots.default?.({
                    ...ctx,
                    bounds: bounds.value
                })
            )
            : undefined
    },
})
