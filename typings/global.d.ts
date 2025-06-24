interface Window {
    [K: `\$${string}`]: unknown
}

declare const __component_name__: string

declare module "*.css" {
    const classes: unknown
    export default classes
}
