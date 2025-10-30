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
            <LL.LLayerGroup label="My Favorites">
                <LL.LMarker :latLng="center" :initialOptions="{ title: 'Beijing' }" style="color: #f00">
                    ❤
                    <template #popup>
                        I 💗 Beijing!
                    </template>
                </LL.LMarker>
            </LL.LLayerGroup>
        </LL.LControlLayers>
    </LL.LMap>
</template>

<style lang="scss">
</style>
