import type { Fn } from '../types'

const lifecycleEvents = ['ready', 'remove'] as const
export type LifecycleEvent = typeof lifecycleEvents[number]

export type LifecycleEmits<T> = {
    [K in LifecycleEvent]: (val: T) => void
}

export function validateEmit<
    A extends any[] | void = void,
    V = A extends any[] ? Fn<boolean, A> : (() => boolean)
>(validate?: V): V {
    return (validate ?? null) as V
}

export function defineLifecycleEmits<T>(): LifecycleEmits<T> {
    return lifecycleEvents.reduce(
        /** @see https://vuejs.org/api/options-state.html#emits */
        (res, x) => (res[x] = validateEmit(), res),
        {} as LifecycleEmits<T>
    )
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
