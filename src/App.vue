<script setup lang="ts">
import { LControl, LControlAttribution, LControlLayers, LControlScale, LControlZoom, LLayerGroup, LMap, LMarker, LTileLayer, type LMapContext } from '../lib'

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

function handleReady({ map }: LMapContext) {
    window.$map = map
}

function handleMapClick(e: L.LeafletMouseEvent) {
    const { lat, lng } = e.latlng
    const latLng = [lat, lng].map(x => x.toFixed(6)).join(', ')
    console.log('click:', `[${latLng}]`)
}

</script>

<template>
    <LMap id="map" :options="mapOptions" @ready="handleReady" @click="handleMapClick">
        <LControlZoom />
        <LControlScale />
        <LControlAttribution />
        <LControl>Hello, World!</LControl>

        <LControlLayers>
            <template #baseLayers>
                <LTileLayer label="OpenStreetMap" v-bind="tileLayer" />
            </template>
            <LLayerGroup label="My Favorites">
                <LMarker :latLng="center" :initialOptions="{ title: 'Beijing' }" style="color: #f00">
                    ❤
                    <template #popup>
                        I 💖 Beijing!
                    </template>
                </LMarker>
            </LLayerGroup>
        </LControlLayers>
    </LMap>
</template>

<style lang="scss">
</style>
