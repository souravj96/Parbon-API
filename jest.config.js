module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  // ES6 modules configuration
  extensionsToTreatAsEsm: ['.js'],
  transform: {},
  testMatch: [
    '**/tests/**/*.test.js'
  ]
};
