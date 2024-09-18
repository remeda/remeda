import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["coverage", "dist", "docs", "examples"],
  },
  eslint.configs.recommended,
  jsdoc.configs["flat/recommended-typescript"],
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginUnicorn.configs["flat/recommended"],
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // Whenever we call a built-in function we want to be as transparent as
      // possible so we pass the callback directly without wrapping it with an
      // arrow function. Our typing provides the safety needed here.
      "unicorn/no-array-callback-reference": "off",

      // @see https://tkdodo.eu/blog/array-types-in-type-script
      "@typescript-eslint/array-type": ["error", { default: "generic" }],

      // This isn't very useful in a utility library, a lot of utilities need to
      // access arrays in a random-access way.
      "@typescript-eslint/no-non-null-assertion": "off",

      // When our return type is just `undefined` (like `first([])`) this rule
      // considers the function as returning `void` (which is technically
      // correct because assigning a void function to a variable will result in
      // `undefined`), but this is not an error, it's by design. I don't know
      // what this rule expects us to do in those cases so turning it off for
      // now instead...
      "@typescript-eslint/no-confusing-void-expression": "off",

      // TODO: These rules allow us to really standardize our codebase, but they
      // also do sweeping changes to the whole codebase which is very noisy. We
      // should do it in one sweep sometime in the future.
      "@typescript-eslint/naming-convention": "off",
      "unicorn/prevent-abbreviations": "off",

      // === ESLint ============================================================
      // (We are assuming that the config is extended by eslint's: recommended
      // config)

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
      "no-constructor-return": "error",
      "no-inner-declarations": "error",
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "warn",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      "no-duplicate-imports": "error",
      "no-useless-assignment": "error",
      "require-atomic-updates": "error",

      // Suggestions
      "accessor-pairs": "warn",
      "arrow-body-style": "warn",
      "block-scoped-var": "warn",
      complexity: "warn",
      "consistent-this": "warn",
      curly: "error",
      "default-case-last": "warn",
      eqeqeq: ["error", "always", { null: "always" }],
      "func-name-matching": "warn",
      "func-names": "warn",
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "grouped-accessor-pairs": "warn",
      "guard-for-in": "error",
      "logical-assignment-operators": "warn",
      "new-cap": "warn",
      "operator-assignment": "warn",
      "object-shorthand": "warn",
      "one-var": ["warn", "never"],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
      "prefer-const": "error",
      "prefer-exponentiation-operator": "error",
      "prefer-named-capture-group": "warn",
      "prefer-numeric-literals": "error",
      "prefer-object-has-own": "warn",
      "prefer-object-spread": "error",
      "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
      "prefer-rest-params": "warn",
      "prefer-spread": "error",
      "prefer-template": "error",
      radix: "warn",
      "require-unicode-regexp": "warn",
      "sort-vars": "warn",
      strict: "warn",
      "symbol-description": "warn",
      "vars-on-top": "warn",
      yoda: "warn",

      "no-alert": "error",
      "no-bitwise": "warn",
      "no-caller": "error",
      "no-console": "error",
      "no-div-regex": "warn",
      "no-else-return": ["warn", { allowElseIf: false }],
      "no-eq-null": "warn",
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-extra-label": "error",
      "no-implicit-coercion": ["error", { disallowTemplateShorthand: true }],
      "no-implicit-globals": "warn",
      "no-iterator": "error",
      "no-label-var": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "warn",
      "no-multi-assign": "error",
      "no-multi-str": "warn",
      "no-negated-condition": "warn",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
      "no-object-constructor": "error",
      "no-proto": "error",
      "no-return-assign": ["warn", "always"],
      "no-script-url": "error",
      "no-sequences": ["error", { allowInParentheses: false }],
      "no-undef-init": "warn",
      "no-underscore-dangle": "warn",
      "no-unneeded-ternary": "warn",
      "no-useless-call": "error",
      "no-useless-computed-key": "warn",
      "no-useless-concat": "warn",
      "no-useless-rename": "error",
      "no-useless-return": "warn",
      "no-var": "warn",
      "no-void": ["warn", { allowAsStatement: true }],

      // These rules have better versions in typescript-eslint. The main purpose
      // of putting them here is to help us detect cases where we enable them
      // accidentally instead of the typescript rule; the fact that they are
      // here doesn't mean they are enabled by any of the eslint default
      // configs.
      "class-methods-use-this": "off",
      "consistent-return": "off",
      "default-param-last": "off",
      "dot-notation": "off",
      "init-declarations": "off",
      "max-params": "off",
      "no-array-constructor": "off",
      "no-dupe-class-members": "off",
      "no-empty-function": "off",
      "no-implied-eval": "off",
      "no-invalid-this": "off",
      "no-loop-func": "off",
      "no-magic-numbers": "off",
      "no-redeclare": "off",
      "no-restricted-imports": "off",
      "no-return-await": "off",
      "no-shadow": "off",
      "no-throw-literal": "off",
      "no-unused-expressions": "off",
      "no-unused-vars": "off",
      "no-use-before-define": "off",
      "no-useless-constructor": "off",
      "prefer-destructuring": "off",
      "prefer-promise-reject-errors": "off",
      "require-await": "off",

      // === JSDoc =============================================================
      // (We are assuming that the config is extended by JSDoc's:
      // recommended-typescript extension)

      // Correctness
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": [
        "error",
        {
          // Non-standard JSDoc tags we use to generate documentation; see
          // docs/src/lib/transform.ts.
          definedTags: [
            "signature",
            "dataFirst",
            "dataLast",
            "indexed",
            "lazy",
            "strict",
            "category",
          ],
        },
      ],
      "jsdoc/no-bad-blocks": "error",
      "jsdoc/no-blank-blocks": "error",
      "jsdoc/no-blank-block-descriptions": "error",
      "jsdoc/require-asterisk-prefix": "error",

      // Completeness
      // TODO: Requires manual fixes, enable in a separate PR.
      "jsdoc/no-restricted-syntax": [
        "off",
        {
          contexts: [
            {
              comment:
                "JsdocBlock:not(*:has(JsdocTag[tag=/(dataFirst|dataLast)/]))",
              context: "ExportNamedDeclaration, TSDeclareFunction",
              message: "JSDoc must include either @dataFirst or @dataLast.",
            },
            {
              comment: "JsdocBlock:not(*:has(JsdocTag[tag=signature]))",
              context: "ExportNamedDeclaration, TSDeclareFunction",
              message: "JSDoc must include @signature.",
            },
          ],
        },
      ],
      // TODO: Requires manual fixes, enable in a separate PR.
      "jsdoc/require-jsdoc": [
        "off",
        {
          enableFixer: false,
          // We only require JSDoc for top-level function exports. Assuming
          // that each function has overrides, we only require JSDocs for the
          // overrides (which are TSDeclareFunction) and not the implementation
          // (which is FunctionDeclaration).
          require: { FunctionDeclaration: false },
          contexts: ["Program > ExportNamedDeclaration > TSDeclareFunction"],
        },
      ],
      "jsdoc/require-description": "error",
      "jsdoc/require-example": ["warn", { enableFixer: false }],
      "jsdoc/require-param": "warn",
      // TODO: Requires manual fixes, enable in a separate PR.
      "jsdoc/require-returns": "off",
      // TODO: Requires manual fixes, enable in a separate PR.
      "jsdoc/require-throws": "off",
      "jsdoc/require-yields": "error",

      // Style
      "jsdoc/no-multi-asterisks": ["warn", { allowWhitespace: true }],
      "jsdoc/require-description-complete-sentence": [
        "warn",
        { abbreviations: ["etc.", "e.g.", "i.e."] },
      ],
      "jsdoc/require-hyphen-before-param-description": [
        "error",
        "always",
        { tags: { "*": "never" } },
      ],
      "jsdoc/sort-tags": [
        "error",
        {
          tagSequence: [
            {
              tags: [
                "param",
                "returns",
                "signature",
                "example",
                "dataFirst",
                "dataLast",
                "indexed",
                "lazy",
                "strict",
                "category",
              ],
            },
          ],
          linesBetween: 0,
        },
      ],
      "jsdoc/tag-lines": ["error", "any", { startLines: 1 }],

      // === Typescript ========================================================
      // (We are assuming that the config is extended by typescript's:
      // strictTypeChecked, and stylisticTypeChecked configs)

      // Types are actually stricter than interfaces because they can't be
      // extended via declaration merging, meaning they are immune to some
      // typing edge-cases that interfaces aren't; in @typescript-eslint's
      // "strict" extension this rule is defined the opposite way though(?!).
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],

      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { fixStyle: "inline-type-imports" },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        // These options are copied from: https://typescript-eslint.io/rules/no-unused-vars/#benefits-over-typescript
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "@typescript-eslint/class-methods-use-this": "warn",
      "@typescript-eslint/prefer-destructuring": "warn",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/no-use-before-define": [
        "error",
        // We just want to ensure that types are defined before they are used,
        // other than that we don't need this rule...
        { functions: false, variables: false },
      ],
      "@typescript-eslint/strict-boolean-expressions": [
        "warn",
        {
          // As strict as possible...
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
        },
      ],
      "@typescript-eslint/consistent-type-exports": "warn",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true },
      ],
      "@typescript-eslint/explicit-member-accessibility": "warn",
      "@typescript-eslint/explicit-module-boundary-types": [
        "warn",
        { allowTypedFunctionExpressions: false },
      ],
      "@typescript-eslint/no-import-type-side-effects": "warn",
      "@typescript-eslint/no-magic-numbers": [
        "warn",
        {
          ignore: [-1, 0, 1, 2],
          ignoreNumericLiteralTypes: true,
        },
      ],
      "@typescript-eslint/no-unnecessary-parameter-property-assignment": "warn",
      "@typescript-eslint/no-unnecessary-qualifier": "warn",
      "@typescript-eslint/parameter-properties": [
        "warn",
        { prefer: "parameter-property" },
      ],
      "@typescript-eslint/prefer-enum-initializers": "warn",
      "@typescript-eslint/prefer-readonly-parameter-types": [
        "error",
        {
          ignoreInferredTypes: true,
          allow: [
            {
              from: "lib",
              name: [
                // Built-ins that aren't read-only but aren't detected as such by this rule...
                "Error",
                "Function",
                "IArguments",
                "Iterable",
                "Promise",
                "ReadonlyMap",
                "RegExp",
                "ReadonlySet",
              ],
            },
          ],
        },
      ],
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/prefer-readonly": "warn",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        {
          allowDefaultCaseForExhaustiveSwitch: false,
          requireDefaultForNonUnion: true,
        },
      ],
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/no-shadow": "error",

      // === Unicorn ==========================================================
      // (We are assuming that the config is extended by unicorns's:
      // flat/recommended config)

      "unicorn/better-regex": "warn",
      "unicorn/consistent-destructuring": "warn",
      "unicorn/custom-error-definition": "warn",
      "unicorn/filename-case": ["error", { case: "camelCase" }],
      "unicorn/no-keyword-prefix": "warn",
      "unicorn/no-unused-properties": "warn",
      "unicorn/no-useless-undefined": ["warn", { checkArguments: false }],
      "unicorn/switch-case-braces": ["error", "avoid"],
    },
  },
  {
    files: ["*.config.js", "*.config.ts"],
    rules: {
      "jsdoc/require-example": "off",
      "jsdoc/require-param": "off",
      "unicorn/filename-case": "off",
    },
  },
  {
    files: ["src/**/*.test.ts", "src/**/*.test-d.ts", "test/**/*.*"],
    rules: {
      "@typescript-eslint/class-methods-use-this": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "unicorn/no-null": "off",
      "unicorn/no-useless-undefined": [
        "warn",
        { checkArguments: false, checkArrowFunctionBody: false },
      ],
    },
  },
  {
    files: ["src/internal/*.ts"],
    rules: {
      // Skip some JSDoc rules for internal-only functions:
      "jsdoc/require-example": "off",
      "jsdoc/require-param": "off",
    },
  },
);
