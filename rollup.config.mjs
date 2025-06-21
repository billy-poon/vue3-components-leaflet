import replace from '@rollup/plugin-replace'
import merge from 'deepmerge'
import path from 'path'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import { fileURLToPath } from 'url'

// https://github.com/tusen-ai/naive-ui/blob/main/rollup.config.js

const appDir = path.dirname(fileURLToPath(import.meta.url))

const baseConfig = defineConfig({
    input: path.resolve('./lib/index.ts'),
    external: ['vue', 'leaflet'],
    plugins: [
        esbuild({
            tsconfig: path.join(appDir, 'tsconfig.esbuild.json'),
            target: 'esnext',
            sourceMap: true,
        }),
        replace({
            preventAssignment: true,
            '__component_name__': (file) => {
                const extname = path.extname(file)
                const basename = path.basename(file, extname)
                const result = basename === 'index'
                    ? path.basename(path.dirname(file))
                    : basename

                return JSON.stringify(result)
            }
        })
    ]
})

const esmConfig = defineConfig({
    output: {
        format: 'esm'
    }
})

const umdConfig = defineConfig({
    output: {
        name: 'vue3-leaflet',
        file: path.join(appDir, 'dist/umd/index.js'),
        format: 'umd',
        exports: 'named',
        globals: {
            vue: 'Vue',
            leaflet: 'L',
        }
    }
})

const esmOutputConfig = defineConfig({
    output: {
        file: path.resolve('dist/es/index.mjs')
    }
})

const esmLibOutputConfig = defineConfig({
    output: {
        preserveModules: true,
        dir: path.resolve('dist/lib'),
    }
})

export default [
    merge.all([baseConfig, esmConfig, esmLibOutputConfig]),
    merge.all([baseConfig, esmConfig, esmOutputConfig]),
    merge.all([baseConfig, umdConfig]),
]
