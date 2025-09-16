import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  external: [
    'react',
    'react-dom',
    'prop-types',
    'reactstrap',
    'react-number-format',
    'react-datepicker'
  ]
})
