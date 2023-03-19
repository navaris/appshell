const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  testRegex: '/__tests__/.+\\.spec\\.(js|tsx?)$',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
      },
    ],
  },
  testEnvironment: 'node',
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(yaml)/)'],
  coverageReporters: ['text', 'cobertura'],
};
