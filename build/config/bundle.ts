import terser from '@rollup/plugin-terser'
import CleanCSS from 'clean-css'
import path from 'path'
import { defineConfig } from 'rollup'
import copy from 'rollup-plugin-copy'
import esbuild from 'rollup-plugin-esbuild'
import { externalGlobals } from './base'

const __lib = 'vue3-leaflet'

export function defineBundleConfig(root: string, minify: boolean) {
    const name = __lib + (
        minify ? '.min' : ''
    )

    const plugins = [
        esbuild({
            target: 'es6'
        }),
        copy({
            targets: [
                {
                    src: path.join(root, 'dist/lib/style.css'),
                    dest: path.join(root, `dist`),
                    transform: (css) => {
                        return minify
                            ? new CleanCSS().minify(css).styles
                            : css
                    },
                    rename: () => `${name}.css`
                }
            ]
        })
    ]

    if (minify) {
        plugins.push(terser())
    }

    return defineConfig({
        plugins,
        input: path.join(root, 'dist/lib/index.js'),
        output: [
            {
                format: 'esm',
                sourcemap: true,
                file: path.join(root, `dist/${name}.mjs`),
            },
            {
                format: 'umd',
                sourcemap: true,
                file: path.join(root, `dist/${name}.js`),
                name: __lib,
                globals: externalGlobals,
            },
        ]
    })
}
