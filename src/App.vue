<script setup lang="ts">
import L from 'leaflet'
import { shallowRef, watchEffect } from 'vue'

const center: L.LatLngExpression = [39.907337, 116.391263]
const mapOptions: L.MapOptions = {
    center,
    zoom: 13,
    maxZoom: 18,
    attributionControl: false,
}

const el = shallowRef<HTMLElement>()
watchEffect((onCleanup) => {
    const val = el.value
    if (val == null) return;

    const map = L.map(val, mapOptions)
        .addLayer(
            // https://wiki.openstreetmap.org/wiki/Raster_tile_providers
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        )
        .addLayer(
            L.marker(center)
        )

    onCleanup(() => {
        map.remove()
    })
})

</script>

<template>
  <div id="map" ref="el" />
</template>

<style scoped>
#map {
    width: 100%;
    height: 100%;
}
</style>
