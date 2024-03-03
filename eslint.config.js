const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    ignores: ["dist", "docs", "examples"],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
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

      // @see https://tkdodo.eu/blog/array-types-in-type-script
      "@typescript-eslint/array-type": ["error", { default: "generic" }],

      // TODO: Once we bump our Typescript target version to ES2015 or above we
      // can migrate all `argument` to variadic rest params. This will remove
      // a step currently done in all purried functions to convert the arguments
      // into an array.
      "prefer-rest-params": "off",

      // This isn't very useful in a utility library, a lot of utilities need to
      // access arrays in a random-access way.
      // TODO: Once we bump our typescript `target` we should enable this rule again, go over all the non-null-assertions, and see which ones are due to a for loop which could use `Array.prototype.entries` instead.
      "@typescript-eslint/no-non-null-assertion": "off",

      // When our return type is just `undefined` (like `first([])`) this rule
      // considers the function as returning `void` (which is technically
      // correct because assigning a void function to a variable will result in
      // `undefined`), but this is not an error, it's by design. I don't know
      // what this rule expects us to do in those cases so turning it off for
      // now instead...
      "@typescript-eslint/no-confusing-void-expression": "off",

      // TODO: Once we bump our typescript `target` we should enable this rule
      "prefer-object-has-own": "off",

      // TODO: Once we bump our minimum Typescript version above 4.5 we need to change the linting to prefer the inline style which allows us to combine type imports and regular ones:
      "no-duplicate-imports": "off",
      "@typescript-eslint/consistent-type-imports": ["warn"],

      // -----------------------------------------------------------------------
      // TODO: These rules are part of the typescript configs but require manual fixes which I want to do in a separate PR for easier reviewing and reverting. Turning them off for now so that our CI is green.
      "@typescript-eslint/class-literal-property-style": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",

      // -----------------------------------------------------------------------

      // === ESLint ============================================================
      // (We are assuming that the config is extended by eslint's: recommended
      // extension)

      // --- Optional Rules ----------------------------------------------------
      // These aren't enabled by default

      // Possible Problems
      "array-callback-return": [
        "warn",
        {
          checkForEach: true,
          // Recommended by unicorn
          // @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-undefined.md
          allowImplicit: true,
        },
      ],
      "no-await-in-loop": "error",
      "no-constant-binary-expression": "error",
      "no-new-native-nonconstructor": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "no-promise-executor-return": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "no-self-compare": "error",
      "no-template-curly-in-string": "warn",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      "require-atomic-updates": "error",

      // Suggestions
      "arrow-body-style": "warn",
      curly: "error",
      "default-case-last": "warn",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "dot-notation": "warn",
      // TODO: Requires manual fixes, enable in a separate PR.
      // eqeqeq: ["error", "always", { null: "always" }],
      // TODO: Requires manual fixes, enable in a separate PR.
      // "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      // TODO: Requires manual fixes, enable in a separate PR.
      // "guard-for-in": "error",
      "logical-assignment-operators": "warn",
      "operator-assignment": "warn",
      "object-shorthand": "warn",
      "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
      "prefer-const": "error",
      "prefer-exponentiation-operator": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "prefer-named-capture-group": "warn",
      "prefer-numeric-literals": "error",
      "prefer-object-spread": "error",
      "prefer-promise-reject-errors": ["error", { allowEmptyReject: false }],
      "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
      "prefer-spread": "error",
      "prefer-template": "error",
      "require-await": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "require-unicode-regexp": "warn",
      "symbol-description": "warn",

      "no-alert": "error",
      "no-array-constructor": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "no-bitwise": "warn",
      "no-caller": "error",
      "no-console": "error",
      "no-else-return": ["warn", { allowElseIf: false }],
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-extra-label": "error",
      "no-implicit-coercion": ["error", { disallowTemplateShorthand: true }],
      "no-implied-eval": "error",
      "no-iterator": "error",
      "no-label-var": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "warn",
      "no-multi-assign": "error",
      "no-negated-condition": "warn",
      "no-new": "error",
      "no-new-func": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "no-new-wrappers": "error",
      "no-object-constructor": "error",
      "no-octal-escape": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "no-param-reassign": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "no-plusplus": ["warn", { allowForLoopAfterthoughts: true }],
      "no-proto": "error",
      "no-return-assign": ["warn", "always"],
      "no-script-url": "error",
      "no-sequences": ["error", { allowInParentheses: false }],
      "no-throw-literal": "error",
      "no-unneeded-ternary": "warn",
      "no-useless-call": "error",
      "no-useless-computed-key": "warn",
      "no-useless-concat": "warn",
      "no-useless-rename": "error",

      // === Typescript ========================================================
      // (We are assuming that the config is extended by typescript's:
      // strict-type-checked, and stylistic-type-checked extensions)

      // --- Overrides ---------------------------------------------------------
      // These are rules defined in the recommended extension that we needed to
      // make changes to.

      // Types are actually stricter than interfaces because they can't be
      // extended via declaration merging, meaning they are immune to some
      // typing edge-cases that interfaces aren't; in @typescript-eslint's
      // "strict" extension this rule is defined the opposite way though(?!).
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          // The default config for this rule doesn't provide *some* way of
          // ignoring an unused argument, and we need one!
          argsIgnorePattern: "^_",
          // This allows removing props by destructuring an object, which is
          // useful in arrow functions.
          ignoreRestSiblings: true,
        },
      ],

      // --- Optional ----------------------------------------------------------
      // These aren't enabled by default

      // Style & Conventions
      // TODO: Requires manual fixes, enable in a separate PR.
      // "prefer-destructuring": "off",
      // "@typescript-eslint/prefer-destructuring": [
      //   "warn",
      //   { array: true, object: true },
      //   { enforceForRenamedProperties: true },
      // ],
      "@typescript-eslint/sort-type-constituents": "warn",
      "@typescript-eslint/promise-function-async": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "no-unused-expressions": "off",
      // "@typescript-eslint/no-unused-expressions": [
      //   "error",
      //   { enforceForJSX: true },
      // ],
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": [
        "error",
        // We just want to ensure that types are defined before they are used,
        // other than that we don't need this rule...
        { functions: false, variables: false },
      ],
      // TODO: Requires manual fixes, enable in a separate PR.
      // "@typescript-eslint/strict-boolean-expressions": [
      //   "warn",
      //   {
      //     // As strict as possible...
      //     allowString: false,
      //     allowNumber: false,
      //     allowNullableObject: false,
      //   },
      // ],
      // @see https://github.com/prettier/eslint-config-prettier#forbid-unnecessary-backticks
      quotes: "off",
      "@typescript-eslint/quotes": [
        "warn",
        "double",
        { avoidEscape: true, allowTemplateLiterals: false },
      ],

      // Security & Correctness
      // TODO: Requires manual fixes, enable in a separate PR.
      // "@typescript-eslint/prefer-readonly-parameter-types": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/prefer-regexp-exec": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        { requireDefaultForNonUnion: true },
      ],
      "default-param-last": "off",
      "@typescript-eslint/default-param-last": "error",
      "no-return-await": "off",
      "@typescript-eslint/return-await": ["error", "always"],
      "@typescript-eslint/method-signature-style": "error",
      "no-loop-func": "off",
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/no-require-imports": "error",
      // TODO: Requires manual fixes, enable in a separate PR.
      // "no-shadow": "off",
      // "@typescript-eslint/no-shadow": [
      //   "error",
      //   { ignoreTypeValueShadow: false },
      // ],
      "@typescript-eslint/no-unsafe-unary-minus": "error",
    },
  },
  {
    files: ["*.config.js"],
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-call": "off",
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
