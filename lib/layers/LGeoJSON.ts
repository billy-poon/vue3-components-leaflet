import { defineComponent, type PropType } from 'vue'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

type GeoJSON = L.GeoJSON<any, any>
type GeoJSONOptions = L.GeoJSONOptions<any, any>

export const LGeoJSON = defineComponent({
    name: __component_name__,
    props: {
        data: [Object, Array] as PropType<unknown>,
       ...defineLayerProps<GeoJSONOptions>(),
    },
    emits: defineLayerEmits<GeoJSON>(),
    slots: defineLayerSlots<GeoJSON>(),
    setup(props, context) {
        setupLayer(
            (options) => _L.geoJSON(props.data as any ?? null, options),
            context,
            props
        )

        return () => void 0
    }
})
