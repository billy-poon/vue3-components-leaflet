export type Fn<T = any, A extends any[] = []> = (...args: A) => T
export type Factory<T, A extends any[] = []> = Fn<T, A>

export type Class<T> = abstract new(...args: any) => T
export type Constructor<T> = new(...args: any) => T
