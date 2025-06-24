import { defineComponent, h, shallowRef, watchEffect, type SlotsType } from 'vue'
import { L, defineControl, defineControlProps } from '../leaflet'
import type { ComponentPublicProps, LControlContext } from '../types'
import './LControl.css'

type ControlPrivates = {
    _html: HTMLElement
}

const CustomControl = L.Control.extend({
    options: {
        position: 'bottomright'
    } satisfies L.ControlOptions,

    initialize(this: ControlPrivates, html: HTMLElement, options?: L.ControlOptions) {
        L.Util.setOptions(this, options)
        this._html = html
    },

    onAdd(this: ControlPrivates) {
        return this._html
    }
})

export type LCustomControl = InstanceType<typeof CustomControl>

const CustomControlClass = CustomControl as {
    new(html: HTMLElement, options?: L.ControlOptions): LCustomControl
}

function customControl(html: HTMLElement, options?: L.ControlOptions): LCustomControl {
    return new CustomControlClass(html, options)
}

export const controlProps = {
    selectable: Boolean,
    ...defineControlProps<L.ControlOptions>(),
}
export type ControlProps = ComponentPublicProps<typeof controlProps>

export type ControlSlots = {
    default?: (ctx: LControlContext<LCustomControl>) => any
}

export const LControl = defineComponent({
    name: __component_name__,
    props: controlProps,
    slots: {} as SlotsType<ControlSlots>,
    setup(props, context) {

        const el = shallowRef<HTMLElement>()

        const { control: ctrl, ctx } = defineControl(
            async (options) => {
                const html = el.value
                if (html == null) {
                    return null
                }

                html.remove()
                return customControl(html, options)
            },
            context,
            props,
        )

        watchEffect((onCleanup) => {
            const html = el.value
            if (html == null) return

            const { selectable } = props
            if (!selectable) return

            const eventHandler = (e: MouseEvent) => e.stopPropagation()
            const eventOptions: AddEventListenerOptions = { capture: true }

            html.addEventListener('click', eventHandler, eventOptions)
            html.addEventListener('dblclick', eventHandler, eventOptions)
            html.addEventListener('mousedown', eventHandler, eventOptions)

            onCleanup(() => {
                html.removeEventListener('mousedown', eventHandler, eventOptions)
                html.removeEventListener('dblclick', eventHandler, eventOptions)
                html.removeEventListener('click', eventHandler, eventOptions)
            })
        })

        return () => h('div',
            { class: 'l-control', ...context.attrs, ref: el },
            ctrl.value != null
                ? context.slots.default?.(ctx)
                : undefined
        )
    }
})
