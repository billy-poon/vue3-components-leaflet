<script setup lang="ts">
import { _L, LControlLayers, LMap, LTileLayer, type LMapContext } from '../lib'

const center: L.LatLngExpression = [39.907337, 116.391263]
const mapOptions: L.MapOptions = {
    center,
    zoom: 13,
    maxZoom: 18,
    // attributionControl: false,
}

const tileLayer = {
    // https://wiki.openstreetmap.org/wiki/Raster_tile_providers
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
        attribution: '&copy;<a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    } satisfies L.TileLayerOptions
}

function handleReady({ map }: LMapContext) {
    map.addLayer(
        _L.marker(center)
    )

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
        <LControlLayers>
            <template #baseLayers>
                <LTileLayer label="OpenStreetMap" v-bind="tileLayer" />
            </template>
        </LControlLayers>
    </LMap>
</template>

<style lang="scss">
</style>
