module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/app.js',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 30000,
  transformIgnorePatterns: [
    'node_modules/(?!(axios|twilio)/)'
  ],
  moduleNameMapper: {
    '^axios$': '<rootDir>/tests/__mocks__/axios.js',
    '^twilio$': '<rootDir>/tests/__mocks__/twilio.js'
  }
};
