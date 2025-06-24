import type { App } from 'vue'
import * as components from './components'
import type { Fn } from './types'

export function install(app: App) {
    Object.entries(components).forEach(([k, v]) => {
        if (isComponent(v)) {
            const name = v.name ?? k
            const registered = app.component(name)
            if (registered == null) {
                app.component(name, v)
            }
        }
    })
}

type Component = {
    name?: string
    setup?: Fn
}

function isComponent(val: unknown): val is Component {
    const comp = val as Component
    return comp != null
        && typeof comp['setup'] === 'function'
}
