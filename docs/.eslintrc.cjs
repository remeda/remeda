/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
  },

  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  plugins: ["@typescript-eslint", "react"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "prettier",
  ],

  settings: {
    react: {
      version: "detect",
    },
  },

  rules: {
    // We stay consistent with the main project on this...
    "@typescript-eslint/array-type": ["error", { default: "generic" }],
  },

  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
};
