import * as L from 'leaflet'
import type { Fn } from '../types'

export function debounce<T extends Fn<void>>(fn: T, ms: number, context?: unknown) {
    let timer: ReturnType<typeof setTimeout> | undefined

    return function (this: any, ...args: any) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.call(this ?? context, ...args)
        }, ms)
    } as T
}

export function mergeOptions<T>(options: T | undefined, obj: Partial<T>) {
    const result: any = { ...options }
    Object.entries(obj)
        .forEach(([k, v]) => {
            if (v !== undefined) {
                result[k] = v
            }
        })

    return result as T
}

export function latLng(val: L.LatLngExpression) {
    return val instanceof L.LatLng
        ? val
        : L.latLng(val)
}

export function latLngBounds(val: L.LatLngBoundsExpression) {
    return val instanceof L.LatLngBounds
        ? val
        : L.latLngBounds(val)
}
