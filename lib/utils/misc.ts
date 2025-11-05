import type { Fn } from '../types'

//https://github.com/Leaflet/Leaflet/blob/master/src/core/Util.js#L64
export function throttle<T extends Fn<any, any>>(fn: T, ms = 300, context?: unknown) {
    let _lock = false
    let _args: unknown[] | null = null

    function later() {
        _lock = false
        if (_args != null) {
            wrapperFn.apply(context, _args)
            _args = null
        }
    }

    function wrapperFn(...args: unknown[]) {
        if (_lock) {
            _args = args
        } else {
            fn.apply(context, args)
            setTimeout(later, ms)
            _lock = true
        }
    }

    return wrapperFn as T
}


type KeyboardShortcutsOptions = {
    stop?: boolean
    prevent?: boolean
    [K: string]: boolean | undefined | ((e: KeyboardEvent) => void | false)
}

export function createKeyboardShortcuts(options: KeyboardShortcutsOptions) {
    const { prevent, stop } = options
    return function (this: unknown, e: KeyboardEvent) {
        const { ctrlKey, shiftKey, altKey, code } = e
        const key = [
            ctrlKey ? 'Ctrl' : '',
            shiftKey ? 'Shift' : '',
            altKey ? 'Alt' : '',
            code
        ].filter(Boolean).join('+')

        const handler = options[key]
        if (typeof handler === 'function') {
            const result = handler.call(this, e)
            if (result !== false) {
                if (prevent) {
                    e.preventDefault()
                }
                if (stop) {
                    e.stopPropagation()
                }
            }
        }
    }
}
