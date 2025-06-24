import G, { type CRSTypes } from 'gcoord'
import * as L from 'leaflet'

// cSpell: ignore gcoord

type Patch = Partial<L.CRS>

function latLngObj(latLng: L.LatLngExpression) {
    return latLng instanceof L.LatLng
        ? latLng : L.latLng(latLng)
}

function createCRS(proto: L.CRS, layerType: CRSTypes, displayType: CRSTypes) {
    return L.Util.extend({}, proto, {
        project: (latLng) => {
            const p1 = latLngObj(latLng)
            const [lng, lat] = G.transform([p1.lng, p1.lat], displayType, layerType)
            return proto.project(L.latLng([lat, lng]))
        },
        // cSpell: ignore unproject
        unproject: (point) => {
            const p1 = proto.unproject(point)
            const [lng, lat] = G.transform([p1.lng, p1.lat], layerType, displayType)
            return L.latLng([lat, lng])
        },
    } satisfies Patch)
}

export const WGS84_AS_BD09 = createCRS(L.CRS.EPSG4326, G.CRSTypes.WGS84, G.CRSTypes.BD09)
export const EPSG4326_AS_BD09 = WGS84_AS_BD09

export const WGS84_AS_GCJ02 = createCRS(L.CRS.EPSG4326, G.CRSTypes.WGS84, G.CRSTypes.GCJ02)
export const EPSG4326_AS_GCJ02 = WGS84_AS_GCJ02

export const WebMercator_AS_BD09 = createCRS(L.CRS.EPSG3857, G.CRSTypes.WGS84, G.CRSTypes.BD09)
export const EPSG3857_AS_BD09 = WebMercator_AS_BD09

export const WebMercator_AS_GCJ02 = createCRS(L.CRS.EPSG3857, G.CRSTypes.WGS84, G.CRSTypes.GCJ02)
export const EPSG3857_AS_GCJ02 = WebMercator_AS_GCJ02
