module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  bracketSpacing: true,
  arrowParens: 'always',
  parser: 'typescript',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'lf',
  printWidth: 120,
  overrides: [
    {
      files: '*.json',
      options: { parser: 'json' },
    },
    {
      files: '*.js',
      options: { parser: 'babel' },
    },
    {
      files: '*.ts',
      options: { parser: 'typescript' },
    },
    {
      files: '*.yml',
      options: { parser: 'yaml' },
    },
    {
      files: '*.md',
      options: { parser: 'markdown' },
    },
  ],
};
