import path from 'path'
import { defineConfig } from 'rollup'

export function defineStyleConfig(root: string) {
    return defineConfig({
        plugins: [

        ],
        input: path.join(root, 'dist/lib/style.css'),
    })
}
