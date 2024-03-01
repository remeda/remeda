/* eslint-disable @typescript-eslint/no-unsafe-call -- I don't understand FlatConfigs, this follows the typescript example so I don't know how to fix it... */

const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    ignores: ["dist", "docs", "examples"],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // We provide function extensions (e.g. lazy, indexed, sub-functions,
      // etc...) via namespaces by design.
      "@typescript-eslint/no-namespace": "off",

      "@typescript-eslint/array-type": [
        "error",
        {
          // We like it this way...
          default: "generic",
        },
      ],

      // TODO: The idiom for using `purry` right now is via the `arguments`
      // reserved keyword, but it's recommended to use a variadic instead (e.g.
      // `function foo(...args: readonly unknown[])`)
      "prefer-rest-params": "off",

      // This isn't very useful in a utility library, a lot of utilities need to
      // access arrays in a random-access way.
      // TODO: Once we bump our typescript `target` we should enable this rule
      // again, go over all the non-null-assertions, and see which ones are due to
      // a for loop which could use `Array.prototype.entries` instead.
      "@typescript-eslint/no-non-null-assertion": "off",

      // When our return type is just `undefined` (like `first([])`) this rule
      // considers the function as returning `void` (which is technically
      // correct because assigning a void function to a variable will result in
      // `undefined`), but this is not an error, it's by design. I don't know
      // what this rule expects us to do in those cases so turning it off for
      // now instead...
      "@typescript-eslint/no-confusing-void-expression": "off",
    },
  },
  {
    files: ["*.config.js"],
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["src/type-fest/**.ts"],
    rules: {
      // Type-fest uses a lot of "banned" types...
      "@typescript-eslint/ban-types": "off",
    },
  },
);
