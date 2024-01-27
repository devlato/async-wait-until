const path = require('path');
const jestConfigUnit = require('./jest.config.base');

module.exports = {
  ...jestConfigUnit,
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.unit.[jt]s?(x)', '**/?(*.)+(spec|test).unit.[jt]s?(x)'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['lcov', 'text-summary'],
  coverageDirectory: 'coverage/unit',
  
  collectCoverageFrom: ['src/**/*.ts', '!src/utils/create_tests.ts'],
  
  testPathIgnorePatterns: [...jestConfigUnit.testPathIgnorePatterns, path.resolve(__dirname, 'tests')],
  testRegex: '.*\\.tests\\.ts$',
};
