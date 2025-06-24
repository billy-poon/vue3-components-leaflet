import { Fragment, h, render, watch, type PropType, type SetupContext, type ShallowRef, type SlotsType } from 'vue'
import { useLayerGroupContext } from '../hooks/layerGroupContext'
import { useLayersControlContext } from '../hooks/layersControlContext'
import { useMapContext } from '../hooks/mapContext'
import type { ComponentProps, Factory, LLayerContext } from '../types'
import { defineEvented, type LifecycleEmits } from './evented'
import { defineObjectProps } from './object'

export function defineLayerProps<T>() {
    return {
        label: String as PropType<string>,
        ...defineObjectProps<T>(),
    }
}

export type LLayerProps<T = any> = ComponentProps<ReturnType<typeof defineLayerProps<T>>>

export type LLayerSlotHandler<T extends L.Layer> = (ctx: LLayerContext<T>) => any
export interface LLayerSlots<T extends L.Layer> extends Record<string, any> {
    popup?: LLayerSlotHandler<T>
    tooltip?: LLayerSlotHandler<T>
}

export function defineLayer<T extends L.Layer, P extends LLayerProps>(
    factory: Factory<T | null, [options: P['options']]>,
    context: SetupContext<LifecycleEmits<T>, SlotsType<LLayerSlots<T>>>,
    props: P
) {
    const mapCtx = useMapContext()
    const layerGroupCtx = useLayerGroupContext()
    const layersControlCtx = useLayersControlContext()

    const { label: defaultLabel } = props

    // cSpell: ignore evented
    const { obj, ...rest } = defineEvented(
        async (options) => {
            const val = await factory(options)
            if (val != null) {
                if (layerGroupCtx != null) {
                    val.addTo(layerGroupCtx.layerGroup)
                } else if (layersControlCtx != null && defaultLabel != null) {
                    layersControlCtx.addLayer(val, defaultLabel)
                } else {
                    val.addTo(mapCtx.map)
                }

                const { popup, tooltip } = context.slots
                if (popup != null) {
                    val.bindPopup(() => {
                        const el = document.createElement('div')
                        el.className = 'l-popup'
                        render(h(Fragment, [popup(ctx)]), el)
                        return el
                    })
                }
                if (tooltip != null) {
                    val.bindTooltip(() => {
                        const el = document.createElement('div')
                        el.className = 'l-tooltip'
                        render(h(Fragment, [tooltip(ctx)]), el)
                        return el
                    })
                }
            }

            return val
        },
        context,
        props
    )

    const layer = obj as Readonly<ShallowRef<T>>
    const ctx: LLayerContext<T> = {
        mapCtx,
        get layer() { return layer.value }
    }
    context.expose({ ctx })

    watch(() => props.label, (nv) => {
        const layerVal = layer.value
        if (layersControlCtx != null) {
            if (layerVal != null) {
                layersControlCtx.removeLayer(layerVal)
                if (nv != null) {
                    layersControlCtx.addLayer(layerVal, nv)
                } else {
                    layerVal.addTo(mapCtx.map)
                }
            }
        }
    })

    return { ...rest, layer, ctx }
}
