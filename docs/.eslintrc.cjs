/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  plugins: ["@typescript-eslint", "react", "jsx-a11y", "astro", "unicorn"],

  extends: [
    "eslint:recommended",
    "plugin:unicorn/recommended",
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-strict",
    "prettier",
  ],

  reportUnusedDisableDirectives: true,

  rules: {
    // We stay consistent with the main project on this...
    "@typescript-eslint/array-type": ["error", { default: "generic" }],

    "unicorn/prevent-abbreviations": "off",
  },

  overrides: [
    {
      files: [".eslintrc.{js,cjs}"],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
    {
      files: ["*.ts", "*.tsx"],

      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },

      extends: [
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:react/jsx-runtime",
      ],

      settings: {
        react: {
          version: "detect",
        },
      },
    },
  ],
};
