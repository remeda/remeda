/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: true,
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

    // This isn't very useful in a utility library, a lot of utilities need to
    // access arrays in a random-access way.
    // TODO: Once we bump our typescript `target` we should enable this rule
    // again, go over all the non-null-assertions, and see which ones are due to
    // a for loop which could use `Array.prototype.entries` instead.
    '@typescript-eslint/no-non-null-assertion': 'off',
  },

  overrides: [
    {
      files: ['**/*rc.js', '**/*.config.js'],
      env: {
        node: true,
      },
    },
    {
      files: ['src/type-fest/**.ts'],
      rules: {
        // Type-fest uses a lot of "banned" types...
        '@typescript-eslint/ban-types': 'off',
      },
    },
  ],
};
