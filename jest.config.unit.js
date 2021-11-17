const path = require('path');
const jestConfigUnit = require('./jest.config.base');

module.exports = {
  ...jestConfigUnit,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/utils/create_tests.ts'],
  testPathIgnorePatterns: [...jestConfigUnit.testPathIgnorePatterns, path.resolve(__dirname, 'tests')],
  testRegex: '.*\\.tests\\.ts$',
};
