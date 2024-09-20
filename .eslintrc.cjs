/** @type {import("eslint").Linter.Config} */
const config = {
  ignorePatterns: ['node_modules/', 'build/', 'dist/', 'public/', 'src/views/sites'],
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    camelcase: 'off',
    semi: ['error', 'always'],
    'space-before-function-paren': 'off',
    'comma-dangle': [2, 'always-multiline'],
    '@typescript-eslint/comma-dangle': [2, 'always-multiline'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    indent: 'off',
    'dot-notation': 'off',
  },
};

module.exports = config;
