module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/client/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testTimeout: 30000
};
