import multiEntry from '@rollup/plugin-multi-entry';
import typescript from '@rollup/plugin-typescript';

export default {
  input: ['./src/element/*.ts', './src/index.ts'],
  output: {
    file: './public/bundle.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [multiEntry(), typescript()],
};
