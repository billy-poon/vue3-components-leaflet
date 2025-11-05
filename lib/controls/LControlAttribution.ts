import { defineComponent } from 'vue'
import { _L } from '../leaflet'
import { defineControlProps, setupControl } from '../utils/control'

export const LControlAttribution = defineComponent({
    name: __component_name__,
    props: defineControlProps<L.Control.AttributionOptions>(),
    setup(props, context) {
        setupControl(
            (options) => {
                options = options ?? {}
                if (options.prefix == null) {
                    options.prefix = false
                }

                return _L.control.attribution(options)
            },
            context,
            props
        )

        return () => void 0
    }
})
