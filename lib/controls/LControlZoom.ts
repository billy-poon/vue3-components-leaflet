import { defineComponent } from 'vue'
import { _L } from '../leaflet'
import { defineControlProps, setupControl } from '../utils/control'

export const LControlZoom = defineComponent({
    name: __component_name__,
    props: defineControlProps<L.Control.ZoomOptions>(),
    setup(props) {
        setupControl(
            (options) => _L.control.zoom(options),
            props
        )

        return () => void 0
    }
})
