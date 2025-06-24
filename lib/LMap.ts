import { defineComponent, h, shallowRef, watch, type PropType, type ShallowRef, type SlotsType } from 'vue'
import { setupMapContext } from './hooks/mapContext'
import { useShadowModel } from './hooks/shadowModel'
import { L, debounce, defineLifecycleEmits, mergeOptions } from './leaflet'
import { defineEvented } from './leaflet/evented'
import { defineObjectProps } from './leaflet/object'
import type { ComponentPublicEmits, ComponentPublicProps, LMapContext, LMapView } from './types'

export const mapProps = {
    zoom: Number,
    center: L.LatLng,
    bounds: L.LatLngBounds,
    defaultBounds: [Object, Array] as PropType<L.LatLngBoundsExpression>,
    ...defineObjectProps<L.MapOptions>(),
}
export type MapProps = ComponentPublicProps<typeof mapProps>

export const mapEmits = {
    'update:zoom': (val: number) => true,
    'update:center': (val: L.LatLng) => true,
    'update:bounds': (val: L.LatLngBounds) => true,
    'view-changed': (val: LMapView) => true,
    ...defineLifecycleEmits<L.Map>(),
}
export type MapEmits = ComponentPublicEmits<typeof mapEmits>

export type MapSlots = {
    default?: (ctx: LMapContext) => any
}

export const LMap = defineComponent({
    name: __component_name__,
    props: mapProps,
    emits: mapEmits,
    slots: {} as SlotsType<MapSlots>,
    setup(props, context) {
        const { emit } = context

        const zoom = useShadowModel(props, 'zoom', emit, {
            onPropChanged: (nv) => nv != null && map.value?.setZoom(nv)
        })
        const center = useShadowModel(props, 'center', emit, {
            onPropChanged: (nv) => nv != null && map.value?.panTo(nv)
        })
        const bounds = useShadowModel(props, 'bounds', emit, {
            onPropChanged: (nv) => nv != null && map.value?.fitBounds(nv)
        })

        const el = shallowRef() as ShallowRef<HTMLElement>
        const view = shallowRef() as ShallowRef<LMapView>

        const {
            zoom: defaultZoom,
            center: defaultCenter,
        } = props

        const { obj, attrs } = defineEvented<L.Map, typeof props>(
            (options) => {
                const html = el.value!
                if (html == null) {
                    return null
                }

                const classList = [...html.classList]

                const val = L.map(html, mergeOptions(options, {
                    zoom: defaultZoom,
                    center: defaultCenter
                }))

                classList.forEach(x => html.classList.add(x))

                // cSpell: ignore zoomend moveend
                val.on('zoomend', () => zoom.value = val.getZoom())
                val.on('moveend', () => center.value = val.getCenter())

                const boundsVal = props.bounds ?? props.defaultBounds
                if (boundsVal != null) {
                    val.fitBounds(boundsVal)
                }

                return val
            },
            context,
            props,
        )

        const map = obj as Readonly<ShallowRef<L.Map>>
        const ctx = setupMapContext({
            get map() { return map.value },
            get mapEl() { return el.value },
            get mapView() { return view.value },
            onMousemove: (handler, ms = 0) => {
                const mapVal = map.value
                if (mapVal == null) {
                    throw new Error('Map is not created')
                }

                const fn = debounce(handler, ms)
                mapVal.on('mousemove', fn)
                return () => {
                    mapVal.off('mousemove', fn)
                }
            }
        })
        context.expose({ ctx })

        watch([map, zoom, center], (([m, z, c]) => {
            if (m != null && z != null && c != null) {
                const val = m.getBounds()
                bounds.value = val
                view.value = {
                    zoom: z,
                    center: c,
                    bounds: val
                }
                emit('view-changed', view.value)
            }
        }))

        return () => h('div',
            { class: 'l-map', ...attrs, ref: el },
            map.value != null
                ? context.slots.default?.(ctx)
                : undefined
        )
    },
})
