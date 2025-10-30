import { computed, defineComponent, h, shallowRef, watch, type PropType } from 'vue'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

export const LSvgOverlay = defineComponent({
    name: __component_name__,
    props: {
        svg: [String, SVGElement] as PropType<string | SVGElement>,
        bounds: {
            type: [Object, Array] as PropType<L.LatLngBoundsExpression>,
            required: true,
        },
       ...defineLayerProps<L.ImageOverlayOptions>(),
    },
    emits: defineLayerEmits<L.SVGOverlay>(),
    slots: defineLayerSlots<L.SVGOverlay, {
        default?: () => any
    }>(),
    setup(props, context) {
        const el = shallowRef<HTMLElement>()

        const displaySVG = computed(() => {
            const { svg } = props
            if (svg != null) {
                return svg
            }

            const html = el.value
            if (html != null) {
                if (html instanceof SVGElement) {
                    html.remove?.()
                    return html
                }

                const child = html.querySelector('svg')
                if (child != null) {
                    child.remove?.()
                    return child
                }
            }

            return null
        })

        const { bounds: initialBounds } = props
        const { layer } = setupLayer(
            (options) => {
                const svg = displaySVG.value
                if (svg == null) return null

                return _L.svgOverlay(svg, initialBounds, options)
             },
            context,
            props
        )

        watch(() => props.bounds, (v) => {
            const val = v instanceof _L.LatLngBounds
                ? v : _L.latLngBounds(v)
            layer.value?.setBounds(val)
        })

        return () => props.svg == null
            ? h('div',
                {
                    ref: el,
                    style: 'display:none',
                },
                context.slots.default?.()
            )
            : void 0
    }
})
