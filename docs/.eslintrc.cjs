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
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "prettier",
  ],

  settings: {
    react: {
      version: "detect",
    },
  },

  rules: {},

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
