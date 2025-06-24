import { defineComponent, watch, type PropType, type SlotsType } from 'vue'
import { useMapContext } from '../hooks/mapContext'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, latLngBounds, type LLayerSlots } from '../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../types'


export const rasterLayerProps = {
    url: {
        type: String,
        required: true as const,
    },
    bounds: [Object, Array] as PropType<L.LatLngBounds | L.LatLngBoundsExpression>,
    ...defineLayerProps<L.ImageOverlayOptions>()
}
export type RasterLayerProps = ComponentPublicProps<typeof rasterLayerProps>

export const rasterLayerEmits = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    'image-load': (el: HTMLImageElement, layer: L.ImageOverlay) => true,
    'update:bounds': (val: L.LatLngBounds) => true,
    ...defineLifecycleEmits<L.ImageOverlay>()
}
export type RasterLayerEmits = ComponentPublicEmits<typeof rasterLayerEmits>

export type RasterLayerSlots = LLayerSlots<L.ImageOverlay>

// https://gdal.org/drivers/raster/wld.html
// https://pro.arcgis.com/en/pro-app/latest/help/data/imagery/world-files-for-raster-datasets.htm
const defaultScale = {
    x: 1,
    y: -0.000022368287037036707 / 0.00002421601562500042,
}

function calculateBounds(width: number, height: number, simpleCRS: boolean) {
    const scale = simpleCRS
        ? Math.min(180 / width, 90 / height)
        : 1

    return L.latLngBounds([[0, 0], [
        height * scale * defaultScale.y,
        width * scale * defaultScale.x,
    ]])
}

const fallbackBounds = [[-90, -180], [90, 180]] as L.LatLngBoundsExpression

export const LRasterLayer = defineComponent({
    name: __component_name__,
    props: rasterLayerProps,
    emits: rasterLayerEmits,
    slots: {} as SlotsType<RasterLayerSlots>,
    setup(props, context) {
        const mapCtx = useMapContext()

        const {
            url: defaultURL,
            bounds: defaultBounds,
        } = props

        const { layer } = defineLayer(
            (options) => {
                const val = L.imageOverlay(defaultURL,
                    defaultBounds ?? fallbackBounds,
                    options
                )

                val.on('load', () => {
                    const el = val.getElement()
                    if (el == null) return

                    const { emit } = context

                    emit('image-load', el, val)
                    if (props.bounds != null) return

                    const { naturalWidth: width, naturalHeight: height } = el
                    const computedBounds = calculateBounds(width, height,
                        mapCtx.map.options.crs === L.CRS.Simple
                    )

                    val.setBounds(computedBounds)
                    emit('update:bounds', computedBounds)
                })

                return val
            },
            context,
            props,
        )

        watch(() => props.url, (nv) =>
            layer.value?.setUrl(nv)
        )

        watch(() => props.bounds, (nv) =>
            nv != null && layer.value?.setBounds(latLngBounds(nv))
        )

        return () => undefined

    },
})
