import type { FeatureGroup, MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet'
import 'leaflet.markercluster'
import { defineComponent } from 'vue'
import { setupLayersGroupContext } from '../hooks/layerGroupContext'
import { useMapContext } from '../hooks/mapContext'
import { _L } from '../leaflet'
import { defineLayerEmits, defineLayerProps, defineLayerSlots, setupLayer } from '../utils/layer'

type MarkerClusterLayer = MarkerClusterGroup | FeatureGroup

export const LMarkerCluster = defineComponent({
    name: __component_name__,
    props: {
       ...defineLayerProps<MarkerClusterGroupOptions>(),
    },
    emits: defineLayerEmits<MarkerClusterLayer>(),
    slots: defineLayerSlots<MarkerClusterLayer, {
        default?: (layer: MarkerClusterLayer) => any
    }>(),
    setup(props, context) {
        if (typeof _L.markerClusterGroup !== 'function') {
            throw new Error('Library `Leaflet.markercluster` is not loaded, @see https://github.com/Leaflet/Leaflet.markercluster')
        }

        const { map } = useMapContext()

        const { layer } = setupLayer(
            (options) => {
                if (!isFinite(map.getMaxZoom())) {
                    console.warn('Map has no maxZoom specified, falling back to FeatureGroup.',)
                    return _L.featureGroup([], options)
                }

                return _L.markerClusterGroup(options)
            },
            context,
            props
        )

        setupLayersGroupContext(layer as any)

        return () => context.slots.default?.(layer.value!)
    }
})
