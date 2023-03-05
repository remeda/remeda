/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRoodDir: __dirname,
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'prettier',
  ],

  reportUnusedDisableDirectives: true,

  rules: {
    // We provide function extensions (e.g. lazy, indexed, sub-functions,
    // etc...) via namespaces by design.
    '@typescript-eslint/no-namespace': 'off',

    '@typescript-eslint/array-type': [
      'error',
      {
        // We like it this way...
        default: 'generic',
      },
    ],

    // TODO: There are a ton of `any` throughout the codebase, they should be
    // replaced by `unknown` or better types.
    '@typescript-eslint/no-explicit-any': 'off',

    // TODO: A lot of related typing issues arise from the fact that `any` is
    // used throughout the codebase.
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',

    // TODO: Some of the cases this surfaces seem trivial fixes, but others
    // might be due to relying on bad types casted explicitly (`as T`) and some
    // due to not having typescript's 'noUncheckedIndexedAccess' enabled.
    '@typescript-eslint/no-unnecessary-condition': 'off',

    // TODO: The idiom for using `purry` right now is via the `arguments`
    // reserved keyword, but it's recommended to use a variadic instead (e.g.
    // `function foo(...args: readonly unknown[])`)
    'prefer-rest-params': 'off',

    // TODO: These have trivial manual fixes
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/unbound-method': 'off',
    'no-prototype-builtins': 'off',
  },

  overrides: [
    {
      files: ['**/*rc.js', '**/*.config.js'],
      env: {
        node: true,
      },
    },
  ],
};
