import { computed, defineComponent, h, nextTick, shallowRef, watch, type PropType } from 'vue'
import { _L } from '../leaflet'
import { validateEmit } from '../utils/emits'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'
import './LMarker.scss'

export const LMarker = defineComponent({
    name: __component_name__,
    props: {
        icon: [String, Object] as PropType<L.Content | L.Icon | L.DivIconOptions>,
        title: String,
        latLng: {
            type: [Object, Array] as PropType<L.LatLngExpression>,
            required: true,
        },
       ...defineLayerProps<L.MarkerOptions>(),
    },
    emits: {
        'move': validateEmit<[val: L.LatLng]>(),
        'update:latLng': validateEmit<[val: L.LatLng]>(),
        ...defineLayerEmits<L.Marker>(),
    },
    slots: defineLayerSlots<L.Marker, {
        default?: (layer: L.Marker) => any
    }>(),
    setup(props, context) {
        const iconConfig = computed(() => {
            return parseIconConfig(props.icon)
        })

        const el = shallowRef<HTMLElement>()
        const displayIcon = computed(() => {
            const { icon, options } = iconConfig.value
            if (icon != null) {
                return icon
            }

            const html = el.value
            return html != null
                ? _L.divIcon({ iconSize: [0, 0], ...options, html })
                : void 0
        })

        const initialIcon = displayIcon.value
        const { latLng: initialLatLng } = props
        const { layer, attrs } = setupLayer(
            (options) => {
                options = { title: props.title, ...options }
                if (options.icon == null && isIcon(initialIcon)) {
                    options.icon = initialIcon
                }

                const result = _L.marker(initialLatLng, options)

                const handleMove = () => {
                    const loc = result.getLatLng()
                    context.emit('move', loc)
                    context.emit('update:latLng', loc)

                    return loc
                }

                result.on('move', () => {
                    handleMove()
                })

                // cSpell: ignore moveend
                result.on('moveend', async () => {
                    const location = handleMove()

                    await nextTick()
                    if (props.latLng != location) {
                        result.setLatLng(props.latLng)
                    }
                })

                return result
            },
            context,
            props
        )

        watch(() => props.latLng, (v) => {
            layer.value?.setLatLng(v)
        })

        watch(displayIcon, (v) => {
            if (v != null) {
                layer.value?.setIcon(v)
            }
        })

        return () => iconConfig.value.icon == null && context.slots.default != null
            ? h('div',
                {
                    ...attrs,
                    ref: el,
                    class: 'l-marker-icon__content',
                },
                [context.slots.default(layer.value!)]
            )
            : void 0
    }
})

function isIcon(val: unknown): val is L.Icon<L.DivIconOptions> {
    return val instanceof _L.Icon
}

type IconConfig = { icon: L.Icon<L.DivIconOptions>, options?: never }
    | { icon?: never, options: L.DivIconOptions }
function parseIconConfig(config?: L.Content | L.Icon | L.DivIconOptions): IconConfig {
    if (isIcon(config)) {
        return { icon: config }
    }

    if (typeof config === 'string') {
        const key = /^(https?:)?\/\//.test(config)
            ? 'iconUrl' : 'html' as const
        config = { [key]: config }
    } else if (config instanceof HTMLElement) {
        config = { html: config }
    }

    const options = { ...config } as L.DivIconOptions
    if (options.html != null) {
        return { icon: _L.divIcon(options) }
    } else if (options.iconUrl != null) {
        return { icon: _L.icon(options as L.IconOptions) }
    }

    options.className = options.className ?? 'l-marker-icon'
    return { options }
}
