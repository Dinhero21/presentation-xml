import multiEntry from '@rollup/plugin-multi-entry';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

const DEV = process.env.ROLLUP_WATCH === 'true';

const plugins = [multiEntry(), typescript(), nodeResolve()];

if (!DEV) {
  plugins.push(terser());
}

export default {
  input: ['./src/element/*.ts', './src/index.ts'],
  output: {
    file: './public/bundle.js',
    format: 'es',
    sourcemap: true,
    footer: 'await entry();',
  },
  plugins,
};
