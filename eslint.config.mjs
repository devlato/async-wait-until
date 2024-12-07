// https://www.npmjs.com/package/@eslint/eslintrc

import * as eslintCompat from '@eslint/compat';
import * as eslintRc from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import url from 'node:url';

const baseDir = path.dirname(url.fileURLToPath(import.meta.url));

const compat = new eslintRc.FlatCompat({
  allConfig: js.configs.all,
  // optional unless you're using "eslint:recommended"
  baseDirectory: baseDir,
  // optional
  recommendedConfig: js.configs.recommended,
  // optional; default: process.cwd()
  resolvePluginsRelativeTo: baseDir, // optional unless you're using "eslint:all"
});

export default eslintCompat.fixupConfigRules([
  ...compat.config({
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'prettier'],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': [0],
      '@typescript-eslint/no-use-before-define': [0],
      'prettier/prettier': 'error',
    },
    env: {
      browser: true,
      node: true,
      jest: true,
      es6: true,
    },
    root: true,
  }),
  {
    ignores: [
      '.git/',
      '.github/',
      '.idea/',
      'coverage/',
      'dist/',
      'docs/',
      'lint/',
      'node_modules/',
      '*.DS_Store',
      '*.lock',
      '*.log',
    ],
  },
]);
