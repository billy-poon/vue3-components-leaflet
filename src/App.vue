<script setup lang="ts">
import * as LL from '../lib'

const center: L.LatLngExpression = [39.907337, 116.391263]
const mapOptions: L.MapOptions = {
    center,
    zoom: 13,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: false,
}

const tileLayer = {
    // https://wiki.openstreetmap.org/wiki/Raster_tile_providers
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
        attribution: '&copy;<a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    } satisfies L.TileLayerOptions
}

const tileLayerWMS = {
    url: 'https://ows.terrestris.de/osm/service?',
    options: {
        layers: 'OSM-WMS',
        attribution: '&copy; <a href="https://www.terrestris.de/de/openstreetmap-wms/">terrestris</a>',
        // crs: LL._L.CRS.EPSG3857
    } satisfies L.WMSOptions
}

const parkMarkers: Record<string, L.LatLngExpression> = {
    '天安门广场': [39.904732, 116.391563],
    '北京市中山公园': [39.910395, 116.388645],
    '北海公园': [39.924614, 116.383324],
    '地坛公园': [39.952780, 116.409245],
    '日坛公园': [39.914476, 116.437912],
    '天坛公园': [39.878786, 116.404266],
    '龙潭公园': [39.877073, 116.435165],
    '北京教学植物园': [39.873780, 116.429844],
    '陶然亭公园': [39.872594, 116.375771],
    '玉渊潭公园': [39.913160, 116.310368],
    '北京动物园': [39.939883, 116.329079],
}

const polygons: Record<string, L.LatLngExpression[]> = {
    'The Palace Museum': [
        [39.92105925506222, 116.38590931892396],
        [39.921437753933944, 116.39518976211549],
        [39.912361432874825, 116.39560818672182],
        [39.91225445183699, 116.39208912849428],
        [39.911398597519096, 116.39212131500246],
        [39.91134922098217, 116.38995409011842],
        [39.912163929289854, 116.38990044593811],
        [39.91201580122741, 116.38637065887453],
    ]
}


function handleReady({ map }: LL.LMapContext) {
    window.$map = map
}

function handleMapClick(e: L.LeafletMouseEvent) {
    const { lat, lng } = e.latlng
    const latLng = [lat, lng].map(x => x.toFixed(6)).join(', ')
    console.log('click:', `[${latLng}]`)
}

</script>

<template>
    <LL.LMap id="map" :options="mapOptions" @ready="handleReady" @click="handleMapClick">
        <LL.LControlZoom />
        <LL.LControlScale />
        <LL.LControlAttribution />
        <LL.LControl>Hello, World!</LL.LControl>

        <LL.LControlLayers>
            <template #baseLayers>
                <LL.LTileLayer.WMS label="OpenStreetMap#wms" v-bind="tileLayerWMS" />
                <LL.LTileLayer label="OpenStreetMap#tile" v-bind="tileLayer" />
            </template>

            <LL.LLayerGroup label="Polygons">
                <LL.LPolygon
                    v-for="(v, k) in polygons" :key="k"
                    :latLngs="v"
                    :title="k"
                    :initialOptions="{ color: '#f00', weight: 2 }"
                    />
            </LL.LLayerGroup>

            <LL.LMarkerCluster label="Markers">
                <LL.LMarker v-for="(v, k) in parkMarkers" :key="k" :latLng="v" :title="k">
                    🏞️
                </LL.LMarker>
            </LL.LMarkerCluster>

            <LL.LMarker
                :latLng="center"
                :initialOptions="{ title: 'Beijing', draggable: true }"
                style="color: #f00"
                >
                ❤
                <template #popup>
                    I 💗 Beijing!
                </template>
            </LL.LMarker>
        </LL.LControlLayers>
    </LL.LMap>
</template>

<style lang="scss">
</style>
