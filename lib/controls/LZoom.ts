import { defineComponent } from 'vue'
import { L, defineControl, defineControlProps } from '../leaflet'
import type { ComponentPublicProps } from '../types'

export const zoomProps = defineControlProps<L.Control.ZoomOptions>()
export type ZoomProps = ComponentPublicProps<typeof zoomProps>

export const LZoom = defineComponent({
    name: __component_name__,
    props: zoomProps,
    setup(props, context) {
        defineControl(
            (options) => {
                return L.control.zoom(options)
            },
            context,
            props,
        )

        return () => {}
    }
})
