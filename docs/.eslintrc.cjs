/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },

  env: {
    browser: true,
    es2020: true,
    node: true,
  },

  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'react-hooks',
    'react',
    'import',
  ],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],

  settings: {
    react: {
      version: '18',
      // React Router stuff...
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
    },
    'import/ignore': ['node_modules', '\\.(css|md|svg|json)$'],
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'] },
    'import/resolver': {
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      typescript: { alwaysTryTypes: true },
    },
  },

  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],

  reportUnusedDisableDirectives: true,

  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    '@typescript-eslint/no-explicit-any': 'off',

    // TODO: Temporarily disabled these rules so we can ship the main changes
    // in this PR more easily. We should fix each one and remove these:
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    'react/no-unescaped-entities': 'off',
  },
};
