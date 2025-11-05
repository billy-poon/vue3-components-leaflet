import { watch, type ExtractPropTypes, type PropType, type SetupContext } from 'vue'
import { useMapContext } from '../hooks/mapContext'
import type { Factory } from '../types'
import { defineObjectProps, setupObject } from './object'

export function defineControlProps<O extends L.ControlOptions>() {
    return {
        position: String as PropType<L.ControlPosition>,
        ...defineObjectProps<O>(),
    }
}

type LControlProps = ExtractPropTypes<ReturnType<typeof defineControlProps<any>>>

export function setupControl<
    T extends L.Control,
    P extends LControlProps
>(
    factory: Factory<T | null, [options: P['options']]>,
    context: SetupContext<any, any>,
    props: P
) {
    const { position: initialPosition } = props
    const { obj: control, watchValueEffect, ...rest } = setupObject(
        (options) => factory(
            initialPosition != null
                ? { position: initialPosition, ...options } satisfies L.ControlOptions
                : options
        ),
        props
    )

    context.expose({
        getControl: () => control.value
    })

    const { map } = useMapContext()
    watchValueEffect((val) => {
        val.addTo(map)
    })

    watch(() => props.position, (v) => {
        v != null && control.value?.setPosition(v)
    })

    return { control, watchValueEffect, ...rest }
}
