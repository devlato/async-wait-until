const path = require('path');
const jestConfig = require('./jest.config.base');

module.exports = {
  ...jestConfig,
  testPathIgnorePatterns: [...jestConfig.testPathIgnorePatterns, path.resolve(__dirname, 'src')],
  testRegex: '.*\\.tests\\.ts$',
};
