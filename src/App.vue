<script setup lang="ts">
import { L, LAttribution, LDrawPolyline, LLayer, LLayerGroup, LLayers, LMap, LMarker, LMouseLocation, LPolygon, LPolyline, LRasterLayer, LRectangle, LScale, LTileLayer, LZoom, type MarkerProps } from '@vue3-components/leaflet'
import { EPSG3857_AS_GCJ02 } from '@vue3-components/leaflet/crs'
import { ref, shallowRef } from 'vue'
import logoSVG from './assets/logo.svg?raw'
import zhongshanMap from './assets/zhongshan.jpg'

const SVG = logoSVG
const rasterLayer = zhongshanMap

// cSpell: ignore zhongshan terrestris

const tileLayers = {
    // https://zhuanlan.zhihu.com/p/641436984
    // https://segmentfault.com/a/1190000044688235
    'AMap Street': 'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
    'AMap Satellite': 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',

    // https://www.technicalgis.com/2022/08/13/how-to-add-google-maps-and-openstreetmap-layers-to-qgis/
    'Google Street': 'https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    'Google Satellite': 'https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
}

const tileLayerWMS: {
    url: string
    label: string
    options: L.WMSOptions
} = {
    url: 'https://ows.terrestris.de/osm/service?',
    label: 'OpenStreetMap',
    options: {
        layers: 'OSM-WMS',
        attribution: '<a href="https://www.terrestris.de/de/openstreetmap-wms/">@terrestris</a>',
        crs: EPSG3857_AS_GCJ02,
        // crs: WGS84_AS_BD09,
    }
}

const bounds = L.latLngBounds([[22.478686,113.300305],[22.575317, 113.486284]])
// const bounds = shallowRef<L.LatLngBounds>()

const defaultBounds: L.LatLngBoundsExpression = [[-90, -180],[90, 180]]

const gcj02Markers: Record<string, MarkerProps> = {
    '广东省中山市': {
        location: [22.516948, 113.392467],
    },
    '博爱长江路口': {
        location: [22.507423, 113.426199],
        defaultOptions: {
            draggable: true,
        }
    },
}

const mapOptions: L.MapOptions = {
    zoomControl: false,
    attributionControl: false,
    // crs: L.CRS.Simple
}

function onCreate(map: L.Map) {
    window.$L = L
    window.$map = map
}

const polylineList: L.LatLngExpression[][] = [
    [[22.549660,113.300114],[22.566781,113.318567],[22.568445,113.319941],[22.571338,113.322172],[22.575340,113.324618]],
    [[22.575380,113.425298],[22.573161,113.425641],[22.569198,113.426714],[22.564680,113.428130],[22.559647,113.429761],[22.553465,113.431692],[22.549026,113.433409],[22.546568,113.434482],[22.542882,113.436584],[22.541852,113.437357],[22.539117,113.439159],[22.537848,113.440061],[22.536382,113.441477],[22.531110,113.446369],[22.526630,113.450789],[22.524609,113.452978],[22.521596,113.457098],[22.519812,113.460102],[22.518147,113.463879],[22.517156,113.467827],[22.516878,113.471174],[22.517275,113.475251],[22.518385,113.480487],[22.519098,113.483748],[22.519257,113.485808],[22.519138,113.487825]],
    [[22.483474,113.300307],[22.480520,113.306272],[22.479449,113.308203],[22.478716,113.309405],[22.478716,113.309405]],
]

const polygonList = ref<L.LatLngExpression[][]>([
    [[22.527869,113.386438],[22.525530,113.386331],[22.525322,113.386395],[22.525163,113.386459],[22.524420,113.387318],[22.524212,113.387704],[22.523776,113.389056],[22.523707,113.389421],[22.523736,113.389732],[22.524797,113.391663],[22.524995,113.391963],[22.528047,113.394152],[22.528483,113.394334],[22.528751,113.394442],[22.528850,113.394452],[22.529950,113.393412],[22.530297,113.392854],[22.530644,113.392060],[22.530773,113.391620],[22.530753,113.391244],[22.530416,113.390096],[22.530347,113.389989],[22.528057,113.389850],[22.528018,113.389539],[22.528186,113.388927],[22.528137,113.388830],[22.528226,113.387822],[22.527869,113.387672]],
])

type Points = L.LatLng[]
const drawingPoints = shallowRef<Points>()
function onUpdate(val: Points) {
    drawingPoints.value = val
}
function onCommit(val: Points) {
    polygonList.value.push(val)

    const text = '[' + val
        .map(({ lat, lng }) => `[${[lat, lng].map(x => x.toFixed(6))}]`)
        .join(',') + ']'

    console.log(text)
}
function onEnd() {
    drawingPoints.value = undefined
}

</script>

<template>
    <LMap :bounds="bounds" :defaultBounds="defaultBounds" @init="onCreate" :options="mapOptions">
        <LZoom />
        <LScale />
        <LAttribution />
        <LMouseLocation class="l-control text-mono" freezable />
        <LDrawPolyline
            position="topleft"
            preview
            @update="onUpdate"
            @commit="onCommit"
            @end="onEnd"
        />

        <LLayers :default-options="{ autoZIndex: false }">
            <template #baseLayers>
                <LTileLayer v-for="(v, k) in tileLayers" :key="k" :label="k" :url="v" />
                <LTileLayer.WMS v-bind="tileLayerWMS" />
            </template>

            <LRasterLayer label="Raster" :url="rasterLayer" :bounds="bounds" />
            <LLayer label="HTML/SVG" :bounds="bounds" :content="SVG" @init="$event.remove()" />

            <LLayerGroup label="Markers">
                <LMarker v-for="(v, k) in gcj02Markers" :key="k" v-bind="v">
                    <template #tooltip>{{ k }}</template>
                    {{ '❤' }}
                </LMarker>
            </LLayerGroup>

            <LLayerGroup label="Polygons">
                <LPolygon v-for="(x, i) in polygonList" :key="i" :points="x" :default-options="{ weight: 1, color: 'red', fillColor: 'rgba(255, 0, 0, .7)' }" />
                <!-- <LPolygon v-for="(x, i) in polygonList" :key="i" :points="x" /> -->
            </LLayerGroup>

            <LLayerGroup label="Polylines">
                <LPolyline v-for="(x, i) in polylineList" :key="i" :points="x" :default-options="{ weight: 5, color: 'red', dashArray: '10 9' }" />
                <!-- <LPolyline v-for="(x, i) in polylineList" :key="i" :points="x" /> -->
            </LLayerGroup>

            <LLayerGroup label="Others">
                <LRectangle :bounds="bounds" :default-options="{ weight: 2, color: 'red', fill: false, interactive: false }" />
                <!-- <LRectangle :bounds="bounds" /> -->
            </LLayerGroup>
        </LLayers>


        <LPolygon v-if="drawingPoints" :points="drawingPoints" :defaultOptions="{ interactive: false }" />
    </LMap>
</template>

<style>
html, body {
    margin: 0;
    padding: 0;
}

.text-mono {
    font-family: ui-monospace,Menlo,Monaco,"Source Code Pro",Consolas,monospace;
}

.l-map.leaflet-container {
    min-height: 100vh;
}

.l-marker-icon-content.leaflet-div-icon {
    color: red;
    font-size: 24px;
    line-height: 1;

    border: none;
    background: transparent;
    transform: translate(-50%, -100%);
}

</style>
