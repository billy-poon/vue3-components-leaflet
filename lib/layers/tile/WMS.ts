import { defineComponent, watch, type SlotsType } from 'vue'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, mergeOptions, type LLayerSlots } from '../../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../../types'


export const wmsProps = {
    url: {
        type: String,
        required: true as const,
    },
    layers: String,
    ...defineLayerProps<L.WMSOptions>()
}
export type WMSProps = ComponentPublicProps<typeof wmsProps>

export const wmsEmits = defineLifecycleEmits<L.TileLayer.WMS>()
export type WMSEmits = ComponentPublicEmits<typeof wmsEmits>

export type WMSSlots = LLayerSlots<L.TileLayer.WMS>

export const WMS = defineComponent({
    name: __component_name__,
    props: wmsProps,
    emits: wmsEmits,
    slots: {} as SlotsType<WMSSlots>,
    setup(props, context) {
        const {
            url: defaultURL,
            layers: defaultLayers,
        } = props
        const { layer } = defineLayer(
            (options) => {
                return L.tileLayer.wms(defaultURL, mergeOptions(options, {
                    layers: defaultLayers
                }))
            },
            context,
            props
        )

        watch(() => props.url, (nv) =>
            layer.value?.setUrl(nv)
        )
        watch(() => props.layers, (nv) =>
            nv != null && layer.value?.setParams({ layers: nv })
        )

        return () => {}
    },
})
