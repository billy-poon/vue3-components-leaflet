import { defineComponent, h, nextTick, shallowRef, watch, type PropType, type SlotsType } from 'vue'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, latLng, mergeOptions, type LLayerSlotHandler, type LLayerSlots } from '../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../types'
import './LMarker.css'

export const markerProps = {
    icon: Object as PropType<L.Icon | L.IconOptions>,
    title: String,
    location: {
        type: [Object, Array] as PropType<L.LatLngExpression>,
        required: true as const,
    },
    ...defineLayerProps<L.MarkerOptions>()
}
export type MarkerProps = ComponentPublicProps<typeof markerProps>

export const markerEmits = {
    'move': (val: L.LatLng) => true,
    'update:location': (val: L.LatLng) => true,
    ...defineLifecycleEmits<L.Marker>(),
}
export type MarkerEmits = ComponentPublicEmits<typeof markerEmits>

export type MarkerSlots = LLayerSlots<L.Marker> & {
    default?: LLayerSlotHandler<L.Marker>
}

function iconObj(options: L.Icon | L.IconOptions) {
    return options instanceof L.Icon
        ? options
        : L.icon(options)
}

export const LMarker = defineComponent({
    name: __component_name__,
    props: markerProps,
    emits: markerEmits,
    slots: {} as SlotsType<MarkerSlots>,
    setup(props, context) {
        const {
            icon: defaultIcon,
            location: defaultLocation,
        } = props

        const { layer, ctx } = defineLayer(
            (options) => {
                const { title } = props
                const val = L.marker(defaultLocation, mergeOptions(options, {
                    title,
                    icon: defaultIcon != null
                        ? iconObj(defaultIcon)
                        : undefined
                }))

                const { emit } = context
                val.on('move', () => {
                    const location = val.getLatLng()
                    emit('move', location)
                    emit('update:location', location)
                })

                // cSpell: ignore moveend
                val.on('moveend', async () => {
                    const location = val.getLatLng()
                    emit('update:location', location)

                    await nextTick()
                    if (props.location !== location) {
                        val.setLatLng(props.location)
                    }
                })

                return val
            },
            context,
            props,
        )

        watch(() => props.location, (nv) =>
            nv != null && layer.value?.setLatLng(latLng(nv))
        )

        const iconEl = shallowRef<HTMLElement>()
        watch(() => [layer.value, props.icon, iconEl.value] as const, ([layerVal, icon, html]) => {
            html?.remove()
            if (layerVal == null) return

            if (icon != null) {
                layer.value?.setIcon(iconObj(icon))
            } else if (html != null) {
                const val = L.divIcon({
                    html,
                    iconSize: [0, 0],
                    className: 'l-marker-icon'
                })
                layerVal.setIcon(val)
            }
        })

        return () => props.icon == null && context.slots.default != null
            ? h('div',
                { class: 'l-marker-icon-content leaflet-div-icon', ...context.attrs, ref: iconEl },
                context.slots.default(ctx)
            )
            : undefined
    },
})
