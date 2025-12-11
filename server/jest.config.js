module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.js'],
  globalSetup: '<rootDir>/src/tests/jest.globalSetup.js',
  testTimeout: 30000
};
