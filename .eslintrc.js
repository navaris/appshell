const project = 'tsconfig.json';

module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
  },
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.js', '*.config.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    debugLevel: false,
    ecmaFeatures: {
      jsx: false,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.ts'],
      },
      typescript: {
        alwaysTryTypes: true,
        extensions: ['.ts'],
        project,
      },
    },
  },
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project,
      },
    },
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'warn',
    'no-param-reassign': 'warn',
    'react/jsx-filename-extension': 'off',
  },
};
