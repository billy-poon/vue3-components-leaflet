import merge from 'deepmerge'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineBaseConfig } from './base'
import { defineBundleConfig } from './bundle'
import { defineEsbuildConfig } from './esbuild'
import { defineTypeConfig } from './type'

function defineRollupConfig(root: string) {
    const baseConfig = defineBaseConfig()
    return [
        merge.all([baseConfig, defineTypeConfig(root)]),
        merge.all([baseConfig, defineEsbuildConfig(root)]),
        merge.all([baseConfig, defineBundleConfig(root, false)]),
        merge.all([baseConfig, defineBundleConfig(root, true)]),
    ]
}

// will compile to `dist/rollup.config.mjs`,
// use parent directory as root.
const __dirname = path.resolve(
    path.basename(fileURLToPath(import.meta.url)),
    '..'
)

const config = defineRollupConfig(__dirname)
export default config
