<script setup lang="ts">
import { shallowRef, watchEffect } from 'vue'
import { _L } from '../lib'

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

    const map = _L.map(val, mapOptions)
        .addLayer(
            // https://wiki.openstreetmap.org/wiki/Raster_tile_providers
            _L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        )
        .addLayer(
            _L.marker(center)
        )

    window.$map = map

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
