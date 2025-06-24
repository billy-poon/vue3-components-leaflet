import { type ExtractPropTypes, type ExtractPublicPropTypes } from 'vue'

export type Class<T, A extends any[] = any> = new (...args: A) => T

export type Fn<T = any, A extends any[] = any> = (...args: A) => T

export type Awaitable<T> = T | Promise<T>
export type Factory<T, A extends any[] = any> = (...args: A) => Awaitable<T>

export type EmptyObject = {
    [K: string]: never
}

export type ComponentProps<T> = Readonly<ExtractPropTypes<T>>

export type ComponentPublicProps<T> = Readonly<ExtractPublicPropTypes<T>>

export type ComponentPublicEmits<T extends Record<string, Fn>> = {
    [K in keyof T]: (...payload: Parameters<T[K]>) => void
}

export type LMapView = {
    zoom: number
    center: L.LatLng
    bounds: L.LatLngBounds
}

export type LMapMousemoveHandler = (e: L.LeafletMouseEvent) => void

export type LMapContext = {
    readonly map: L.Map
    readonly mapEl: HTMLElement
    readonly mapView: LMapView
    onMousemove(handler: LMapMousemoveHandler, debounce?: number): Fn<void, []>
}

export type LLayerContext<T extends L.Layer = L.Layer> = {
    readonly layer: T
    mapCtx: LMapContext
}


export type LControlContext<T extends L.Control = L.Control> = {
    readonly control: T
    mapCtx: LMapContext
}
