const project = 'tsconfig.json';

module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.js', '*.config.js', '*.config.cjs'],
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
      '@typescript-eslint/parser': ['.js', '.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
        extensions: ['.js', '.ts'],
        project,
      },
    },
  },
  overrides: [
    {
      files: ['*.js', '*.ts'],
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
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-filename-extension': 'off',
  },
};
