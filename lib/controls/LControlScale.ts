import { defineComponent } from 'vue'
import { _L } from '../leaflet'
import { defineControlProps, setupControl } from '../utils/control'

export const LControlScale = defineComponent({
    name: __component_name__,
    props: defineControlProps<L.Control.ScaleOptions>(),
    setup(props, context) {
        setupControl(
            (options) => _L.control.scale(options),
            context,
            props
        )

        return () => void 0
    }
})
