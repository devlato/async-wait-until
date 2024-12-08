import os from 'os';

export default {
  preset: 'ts-jest',
  automock: false,
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  collectCoverage: false,
  displayName: 'async-wait-until',
  maxConcurrency: os.cpus().length,
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['.cache', 'coverage', 'dist', 'docs', '.git', '.github', '.idea', 'node_modules'],
  testRegex: '.*\\.tests\\.ts$',
};
