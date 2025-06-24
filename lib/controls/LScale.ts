import { defineComponent } from 'vue'
import { L, defineControl, defineControlProps } from '../leaflet'
import type { ComponentPublicProps } from '../types'

export const scaleProps = defineControlProps<L.Control.ScaleOptions>()
export type ScaleProps = ComponentPublicProps<typeof scaleProps>

export const LScale = defineComponent({
    name: __component_name__,
    props: scaleProps,
    setup(props, context) {
        defineControl(
            (options) => {
                return L.control.scale(options)
            },
            context,
            props,
        )

        return () => {}
    }
})
