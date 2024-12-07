import path from 'node:path';
import jestConfig from './jest.config.base.mjs';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default {
  ...jestConfig,
  testPathIgnorePatterns: [...jestConfig.testPathIgnorePatterns, path.resolve(__dirname, 'src')],
  testRegex: '.*\\.tests\\.ts$',
};
