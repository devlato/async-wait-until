import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pckg from './package.json';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const OUTPUT_CONFIG = {
  banner: [
    `/**`,
    ` * ${pckg.name} ${pckg.version}`,
    ` * ${pckg.description}`,
    ` * ${pckg.homepage}`,
    ` * (c) ${pckg.author}, under the ${pckg.license} license`,
    ` */`,
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
      file: 'dist/index.amd.js',
      format: 'amd',
    },
    {
      ...OUTPUT_CONFIG,
      file: 'dist/index.commonjs.js',
      format: 'cjs',
    },
    {
      ...OUTPUT_CONFIG,
      file: 'dist/index.es.js',
      format: 'es',
    },
    {
      ...OUTPUT_CONFIG,
      file: 'dist/index.iife.js',
      format: 'iife',
      name: 'asyncWaitUntil',
    },
    {
      ...OUTPUT_CONFIG,
      file: 'dist/index.system.js',
      format: 'system',
    },
  ],
  plugins: [
    typescript({
      clean: true,
      rollupCommonJSResolveHack: true,
    }),
    commonjs({ extensions: ['.js', '.ts'] }),
    ...(IS_PRODUCTION ? [terser()] : []),
  ],
};
