import _replace from '@rollup/plugin-replace'
import path from 'path'

export function replace() {
    return _replace({
        preventAssignment: true,
        values: {
            '__component_name__'(file) {
                const extname = path.extname(file)
                const basename = path.basename(file, extname)
                const result = basename === 'index'
                    ? path.basename(path.dirname(file))
                    : basename

                return JSON.stringify(result)
            }
        }
    })

}
