// eslint-disable-next-line @typescript-eslint/no-var-requires
const os = require('os');

module.exports = {
  preset: 'ts-jest',
  automock: false,
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  collectCoverage: true,
  displayName: 'async-wait-until',
  maxConcurrency: os.cpus().length,
  testURL: 'http://localhost',
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['dist', 'node_modules', '.cache', 'coverage'],
  testRegex: '.*\\.tests\\.ts$',
};
