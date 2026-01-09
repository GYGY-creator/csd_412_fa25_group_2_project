module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.js'],
  globalSetup: '<rootDir>/src/tests/jest.globalSetup.js',
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!src/migrations/**',
    '!src/seeders/**'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
