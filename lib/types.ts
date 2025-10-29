export type Fn<T = any, A extends any[] = []> = (...args: A) => T
export type Factory<T, A extends any[] = []> = Fn<T, A>
