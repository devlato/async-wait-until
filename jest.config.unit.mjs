import path from 'node:path';
import jestConfig from './jest.config.base.mjs';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default {
  ...jestConfig,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/utils/create_tests.ts'],
  testPathIgnorePatterns: [...jestConfig.testPathIgnorePatterns, path.resolve(__dirname, 'tests')],
  testRegex: '.*\\.tests\\.ts$',
};
