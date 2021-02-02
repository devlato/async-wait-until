import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pckg from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/waitUntil.ts',
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'async-wait-until',
    sourcemap: true,
    banner: [
      `/**`,
      ` * ${pckg.name} ${pckg.version}`,
      ` * ${pckg.description}`,
      ` * ${pckg.homepage}`,
      ` * (c) ${pckg.author}, under the ${pckg.license} license`,
      ` */`,
    ].join('\n'),
    compact: true,
  },
  plugins: [
    typescript({
      clean: true,
      rollupCommonJSResolveHack: true,
    }),
    commonjs({ extensions: ['.js', '.ts'] }),
    ...(isProduction ? [terser()] : []),
  ],
};
