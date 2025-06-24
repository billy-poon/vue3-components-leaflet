import { type PropType, type SetupContext, type ShallowRef, watch } from 'vue'
import { useMapContext } from '../hooks/mapContext'
import type { ComponentProps, Factory, LControlContext } from '../types'
import { defineObject, defineObjectProps } from './object'
import { mergeOptions } from './utils'

export function defineControlProps<T>() {
    return {
        position: String as PropType<L.ControlPosition>,
        ...defineObjectProps<T>(),
    }
}

export type LControlProps<T = any> = ComponentProps<ReturnType<typeof defineControlProps<T>>>

export function defineControl<T extends L.Control, P extends LControlProps>(
    factory: Factory<T | null, [options: P['options']]>,
    context: SetupContext,
    props: P,
) {
    const mapCtx = useMapContext()

    const {
        position: defaultPosition
    } = props

    const { obj, ...rest } = defineObject(
        async (options) => {
            const val = await factory(
                mergeOptions(options, { position: defaultPosition })
            )

            if (val != null) {
                val.addTo(mapCtx.map)
            }

            return val
        },
        props
    )

    const control = obj as Readonly<ShallowRef<T>>
    const ctx: LControlContext<T> = {
        mapCtx,
        get control() { return control.value }
    }
    context.expose(ctx)

    watch(() => props.position, (nv) =>
        nv != null && obj.value?.setPosition(nv)
    )

    return { ...rest, control, ctx }
}
