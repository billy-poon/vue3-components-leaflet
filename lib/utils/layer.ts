import { Fragment, h, render, type ExtractPropTypes, type PropType, type SetupContext, type SlotsType } from 'vue'
import { useEventAttrs } from '../hooks/eventAttrs'
import { useMapContext } from '../hooks/mapContext'
import { _L } from '../leaflet'
import type { Constructor, Factory } from '../types'
import { defineLifecycleEmits } from './emits'
import { defineObjectProps, setupObject } from './object'

export interface LPopupOptions extends L.PopupOptions {
    className?: string
}

export interface LTooltipOptions extends L.TooltipOptions {
    className?: string
}

export function defineLayerProps<O extends L.LayerOptions>() {
    return {
        label: String as PropType<string>,
        popup: [String, Object] as PropType<L.Content | L.Popup | LPopupOptions>,
        tooltip: [String, Object] as PropType<L.Content | L.Tooltip | LTooltipOptions>,
        ...defineObjectProps<O>(),
    }
}

type LLayerProps = ExtractPropTypes<ReturnType<typeof defineLayerProps<any>>>

export function defineLayerEmits<T extends L.Layer>() {
    return defineLifecycleEmits<T>()
}

type LLayerEmits<T extends L.Layer> = ReturnType<typeof defineLayerEmits<T>>

type LLayerSlotHandler<T extends L.Layer = any> = (layer: T) => any
type LLayerSlots<T extends L.Layer> = {
    popup?: LLayerSlotHandler<T>
    tooltip?: LLayerSlotHandler<T>
}

export function defineLayerSlots<T extends L.Layer, S = {}>() {
    return {} as SlotsType<LLayerSlots<T> & S>
}

export function setupLayer<
    T extends L.Layer,
    P extends LLayerProps
>(
    factory: Factory<T | null, [options: P['options']]>,
    context: SetupContext<LLayerEmits<T>, SlotsType<LLayerSlots<T>>>,
    props: P
) {
    const { emit, slots } = context

    const { obj: layer, watchValueEffect, ...rest } = setupObject(
        (options) => {
            const result = factory(options)
            if (result == null) {
                return null
            }

            const popup = resolveOverlay(_L.Popup, props.popup, slots.popup)
            if (popup != null) {
                result.bindPopup(popup.content, popup.options)
            }

            const tooltip = resolveOverlay(_L.Tooltip, props.tooltip, slots.tooltip)
            if (tooltip != null) {
                result.bindTooltip(tooltip.content, tooltip.options)
            }

            return result
        },
        props
    )

    const { attrs, eventAttrs } = useEventAttrs()
    watchValueEffect((val) => {
        val.on(eventAttrs)
        emit('ready', val)
        return () => {
            val.off(eventAttrs)
            emit('remove', val)
        }
    })

    const { map } = useMapContext()
    watchValueEffect((val) => {
        // TODO: add to `Layers` control or `LayerGroup`
        val.addTo(map)
    })

    return { attrs, layer, watchValueEffect, ...rest }
}

function isContent(val: unknown): val is L.Content {
    if (val == null) {
        return false
    } else if (val instanceof HTMLElement) {
        return true
    } else {
        return typeof val !== 'object'
    }
}

function resolveOverlay<
    T,
    O extends { className?: string },
    S extends LLayerSlotHandler
>(clz: Constructor<T>, options?: string | O | T, slot?: S) {
    if (options instanceof clz || isContent(options)) {
        return { content: options as L.Content | T }
    } else if (slot == null) {
        return null
    }

    const { className, ...rest } = (options ?? {}) as O
    const content = (layer: L.Layer) => {
        const el = document.createElement('div')
        if (className != null) {
            el.className = className
        }
        render(h(Fragment, [slot(layer)]), el)
        return el
    }

    return { content, options: rest }
}
