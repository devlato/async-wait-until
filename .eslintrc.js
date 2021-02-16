module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/react',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    ecmaVersion: 5,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
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
};
