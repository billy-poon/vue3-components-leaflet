import { defineComponent } from 'vue'
import { L, defineControl, defineControlProps } from '../leaflet'
import type { ComponentPublicProps } from '../types'

export const attributionProps = defineControlProps<L.Control.AttributionOptions>()
export type AttributionProps = ComponentPublicProps<typeof attributionProps>

export const LAttribution = defineComponent({
    name: __component_name__,
    props: attributionProps,
    setup(props, context) {
        defineControl(
            (options) => {
                return L.control.attribution(options)
            },
            context,
            props,
        )

        return () => {}
    }
})
