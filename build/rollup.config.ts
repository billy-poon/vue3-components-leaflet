import path from 'path'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = defineConfig({
    input: path.join(__dirname, 'config/index.ts'),
    plugins: [
        esbuild({
            target: 'esnext'
        })
    ],
    external: [/node_modules/],
    output: {
        format: 'esm',
        file: path.join(__dirname, '../dist/rollup.config.mjs'),
    }
})

export default [config]
