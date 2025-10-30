import { defineComponent, h, shallowRef, watchEffect, type SlotsType } from 'vue'
import { _L } from '../leaflet'
import { defineControlProps, setupControl } from '../utils/control'
import './LControl.scss'

type CustomControlPrivates = {
    _html: HTMLElement
}

const CustomControlClass = _L.Control.extend({
    options: {
        position: 'bottomright'
    } satisfies L.ControlOptions,

    initialize(this: CustomControlPrivates, html: HTMLElement, options?: L.ControlOptions) {
        _L.Util.setOptions(this, options)
        this._html = html
    },

    onAdd(this: CustomControlPrivates) {
        return this._html
    },
})

export type CustomControl = InstanceType<typeof CustomControlClass>


function customControl(html: HTMLElement, options?: L.ControlOptions): CustomControl {
    const CustomControlCtor = CustomControlClass as {
        new(html: HTMLElement, options?: L.ControlOptions): CustomControl
    }

    return new CustomControlCtor(html, options)
}

export const LControl = defineComponent({
    name: __component_name__,
    props: {
        interactive: Boolean,
        ...defineControlProps<L.ControlOptions>(),
    },
    slots: {} as SlotsType<{
        default?: () => any
    }>,
    setup(props, { attrs, slots }) {
        const el = shallowRef<HTMLElement>()

        setupControl(
            (options) => {
                const val = el.value
                if (val == null) {
                    return null
                }

                val.remove?.()
                return customControl(val, options)
            },
            props
        )

        watchEffect((onCleanup) => {
            const val = el.value
            const { interactive } = props
            if (val == null || !interactive) return

            const handler = (e: MouseEvent) => e.stopPropagation()

            val.addEventListener('click', handler)
            val.addEventListener('dblclick', handler)
            val.addEventListener('mousedown', handler)
            onCleanup(() => {
                val.removeEventListener('mousedown', handler)
                val.removeEventListener('dblclick', handler)
                val.removeEventListener('click', handler)
            })
        })

        return () => h('div',
            {
                class: 'l-control l-control--padding',
                ...attrs,
                ref: el,
            },
            slots.default?.()
        )
    }
})
