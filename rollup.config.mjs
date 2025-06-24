import replace from '@rollup/plugin-replace'
import merge from 'deepmerge'
import path from 'path'
import { defineConfig } from 'rollup'
import copy from 'rollup-plugin-copy'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import { fileURLToPath } from 'url'

// https://github.com/tusen-ai/naive-ui/blob/main/rollup.config.js

const appDir = path.dirname(fileURLToPath(import.meta.url))

const baseConfig = defineConfig({
    external: ['vue', 'leaflet', 'gcoord'],
})

const esbuildConfig = defineConfig({
    input: [
        path.join(appDir, 'lib/index.ts'),
        path.join(appDir, 'lib/crs.ts')
    ],
    plugins: [
        replace({
            preventAssignment: true,
            values: {
                '__component_name__': (file) => {
                    const extname = path.extname(file)
                    const basename = path.basename(file, extname)
                    const result = basename === 'index'
                        ? path.basename(path.dirname(file))
                        : basename

                    return JSON.stringify(result)
                }
            }
        }),
        postcss({
            inject: false,
            extract: 'style.css'
        }),
        esbuild({
            target: 'es6'
        }),
        copy({
            targets: [
                {
                    src: path.join(appDir, 'lib/**/*.css'),
                    dest: path.join(appDir, 'dist/lib'),
                    rename: (_x, _y, file) => {
                        return path.relative(
                            path.join(appDir, 'lib'),
                            file
                        )
                    }
                }
            ]
        }),
    ],
    output: {
        format: 'esm',
        sourcemap: 'inline',
        preserveModules: true,
        dir: path.join(appDir, 'dist/lib')
    }
})

const bundleConfig = defineConfig({
    input: path.join(appDir, 'dist/lib/index.js'),
    plugins: [
        esbuild({
            target: 'es6'
        }),
        copy({
            targets: [
                {
                    src: path.join(appDir, 'dist/lib/style.css'),
                    dest: path.join(appDir, 'dist/css'),
                }
            ]
        })
    ],
    output: [
        {
            format: 'esm',
            file: path.join(appDir, 'dist/index.mjs'),
            sourcemap: true,
        },
        {
            format: 'umd',
            file: path.join(appDir, 'dist/index.js'),
            sourcemap: true,
            name: 'vue3-leaflet',
            globals: {
                vue: 'Vue',
                leaflet: 'L',
            }
        }
    ]
})

const crsConfig = defineConfig({
    input: path.join(appDir, 'dist/lib/crs.js'),
    plugins: [
        esbuild({
            target: 'es6',
        }),
        copy({
            targets: [
                {
                    src: path.join(appDir, 'dist/lib/crs.d.ts'),
                    dest: path.join(appDir, 'dist'),
                }
            ]
        })
    ],
    output: [
        {
            format: 'esm',
            file: path.join(appDir, 'dist/crs.mjs'),
            sourcemap: true,
        },
        {
            format: 'umd',
            file: path.join(appDir, 'dist/crs.js'),
            sourcemap: true,
            name: 'vue3-leaflet-crs',
            globals: {
                leaflet: 'L',
                gcoord: 'gcoord',
            },
        }
    ]
})

const dtsConfig = defineConfig({
    input: path.join(appDir, 'dist/lib/index.d.ts'),
    plugins: [
        postcss({
            inject: false,
            extract: false
        }),
        dts(),
    ],
    output: {
        format: 'esm',
        file: path.join(appDir, 'dist/index.d.ts')
    }
})

export default [
    merge.all([baseConfig, esbuildConfig]),
    merge.all([baseConfig, bundleConfig]),
    merge.all([baseConfig, crsConfig]),
    merge.all([baseConfig, dtsConfig]),
]
