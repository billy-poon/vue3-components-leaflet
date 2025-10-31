import path from 'path'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import { replace } from '../plugins/replace'

export function defineEsbuildConfig(root: string) {
    return defineConfig({
        plugins: [
            replace(),
            postcss({
                inject: false,
                extract: 'style.css',
            }),
            esbuild({
                target: 'es6'
            }),
        ],
        input: path.join(root, 'lib/index.ts'),
        output: {
            format: 'esm',
            sourcemap: false,
            preserveModules: true,
            dir: path.join(root, 'dist/lib'),
        }
    })
}
