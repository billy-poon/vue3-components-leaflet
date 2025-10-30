import { defineComponent } from 'vue'
import { _L } from '../leaflet'
import { defineControlProps, setupControl } from '../utils/control'

export const LControlScale = defineComponent({
    name: __component_name__,
    props: defineControlProps<L.Control.ScaleOptions>(),
    setup(props) {
        setupControl(
            (options) => _L.control.scale(options),
            props
        )

        return () => void 0
    }
})
