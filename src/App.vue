<script setup lang="ts">
import { _L, LMap, type LMapState } from '../lib'

const center: L.LatLngExpression = [39.907337, 116.391263]
const mapOptions: L.MapOptions = {
    center,
    zoom: 13,
    maxZoom: 18,
    attributionControl: false,
}

function handleReady(state: LMapState) {
    const { map } = state
    map.addLayer(
        // https://wiki.openstreetmap.org/wiki/Raster_tile_providers
        _L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ).addLayer(
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
  <LMap id="map" :options="mapOptions" @ready="handleReady" @click="handleMapClick" />
</template>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}
</style>
