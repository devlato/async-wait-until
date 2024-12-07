import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pckg = require('./package.json');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const OUTPUT_CONFIG = {
  banner: [
    '/**',
    ` * ${pckg.name} ${pckg.version}`,
    ` * ${pckg.description}`,
    ` * ${pckg.homepage}`,
    ` * (c) ${pckg.author}, under the ${pckg.license} license`,
    ' */',
  ].join('\n'),
  compact: true,
  sourcemap: true,
};

export default {
  input: 'src/index.ts',
  output: [
    {
      ...OUTPUT_CONFIG,
      exports: 'named',
      file: 'dist/index.js',
      format: 'umd',
      name: 'async-wait-until',
    },
    {
      ...OUTPUT_CONFIG,
      exports: 'named',
      file: 'dist/amd.js',
      format: 'amd',
    },
    {
      ...OUTPUT_CONFIG,
      exports: 'named',
      file: 'dist/commonjs.js',
      format: 'cjs',
    },
    {
      ...OUTPUT_CONFIG,
      exports: 'named',
      file: 'dist/index.esm.js',
      format: 'es',
    },
    {
      ...OUTPUT_CONFIG,
      exports: 'named',
      file: 'dist/iife.js',
      format: 'iife',
      name: 'asyncWaitUntil',
    },
    {
      ...OUTPUT_CONFIG,
      exports: 'named',
      file: 'dist/systemjs.js',
      format: 'system',
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    commonjs({ extensions: ['.js', '.ts'] }),
    ...(IS_PRODUCTION ? [terser()] : []),
  ],
};
