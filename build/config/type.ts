import path from 'path'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'

export function defineTypeConfig(root: string) {
    return defineConfig({
        input: path.join(root, 'dist/lib/index.d.ts'),
        plugins: [
            postcss({
                inject: false,
                extract: false,
            }),
            dts(),
        ],
        external: [/\.s?css$/],
        output: {
            format: 'esm',
            file: path.join(root, 'dist/index.d.ts')
        }
    })
}
