module.exports = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', ['lcov', { projectRoot: './coverage' }], 'text'],
  coverageThreshold: {
    global: {
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/**.GenericRetryStrategy.ts',
  ],
  moduleDirectories: ['node_modules'],
  preset: 'ts-jest',
  roots: ['test'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  reporters: ['default'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  moduleNameMapper: {
    '@src/(.*)': ['<rootDir>/src/$1'],
    '@file-receiver/(.*)': ['<rootDir>/src/file-receiver/$1'],
    '@greyscale-converter/(.*)': ['<rootDir>/src/greyscale-converter/$1'],
    '@infra/(.*)': ['<rootDir>/src/infra/$1'],
    '@s3-uploader/(.*)': ['<rootDir>/src/s3-uploader/$1'],
    '@test/(.*)': ['<rootDir>/test/$1'],
  },
};
