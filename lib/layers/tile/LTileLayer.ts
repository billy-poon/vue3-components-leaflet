import { defineComponent, watch, type SlotsType } from 'vue'
import { L, defineLayer, defineLayerProps, defineLifecycleEmits, type LLayerSlots } from '../../leaflet'
import type { ComponentPublicEmits, ComponentPublicProps } from '../../types'
import { WMS } from './WMS'


export const tileLayerProps = {
    url: {
        type: String,
        required: true as const,
    },
    ...defineLayerProps<L.TileLayerOptions>()
}
export type TileLayerProps = ComponentPublicProps<typeof tileLayerProps>

export const tileLayerEmits = defineLifecycleEmits<L.TileLayer>()
export type TileLayerEmits = ComponentPublicEmits<typeof tileLayerEmits>

export type TileLayerSlots = LLayerSlots<L.TileLayer>

const _LTileLayer = defineComponent({
    name: __component_name__,
    props: tileLayerProps,
    emits: tileLayerEmits,
    slots: {} as SlotsType<TileLayerSlots>,
    setup(props, context) {
        const {
            url: defaultURL
        } = props

        const { layer } = defineLayer(
            (options) => {
                return L.tileLayer(defaultURL, options)
            },
            context,
            props
        )

        watch(() => props.url, (nv) =>
            layer.value?.setUrl(nv)
        )

        return () => {}
    },
})

type LTileLayerWithWMS = typeof _LTileLayer & {
    WMS: typeof WMS
}

export const LTileLayer = _LTileLayer as LTileLayerWithWMS
LTileLayer.WMS = WMS
