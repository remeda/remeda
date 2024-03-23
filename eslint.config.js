import core from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
// @ts-expect-error [ts7016] -- I don't know why typing is broken here...
import { configs as unicornConfigs } from "eslint-plugin-unicorn";
import { config, configs as typescriptConfigs } from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

export default config(
  {
    ignores: ["dist", "docs", "examples"],
  },
  core.configs.recommended,
  // @ts-expect-error [ts7016] -- I don't know why typing is broken here...
  jsdoc.configs["flat/recommended-typescript"],
  ...typescriptConfigs.strictTypeChecked,
  ...typescriptConfigs.stylisticTypeChecked,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- I don't know why typing is broken for unicorn...
  unicornConfigs["flat/recommended"],
  prettierConfig,
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

      // TODO: Once we bump our typescript `target` we should enable this rule
      "prefer-object-has-own": "off",

      // TODO: Once we bump our minimum Typescript version above 4.5 we need to change the linting to prefer the inline style which allows us to combine type imports and regular ones:
      "no-duplicate-imports": "off",
      "@typescript-eslint/consistent-type-imports": ["warn"],

      // TODO: Once we bump our typescript `target` we should enable these rules.
      "unicorn/no-for-loop": "off",
      "unicorn/prefer-at": "off",
      "unicorn/prefer-number-properties": "off",
      "unicorn/prefer-spread": "off",
      "unicorn/prefer-includes": "off",

      // TODO: These rules allow us to really standardize our codebase, but they
      // also do sweeping changes to the whole codebase which is very noisy. We
      // should do it in one sweep sometime in the future.
      "@typescript-eslint/naming-convention": "off",
      "unicorn/prevent-abbreviations": "off",

      // === ESLint ============================================================
      // (We are assuming that the config is extended by eslint's: recommended
      // extension)

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
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "warn",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      "require-atomic-updates": "error",

      // Suggestions
      "arrow-body-style": "warn",
      curly: "error",
      "default-case-last": "warn",
      "dot-notation": "warn",
      eqeqeq: ["error", "always", { null: "always" }],
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "guard-for-in": "error",
      "logical-assignment-operators": "warn",
      "operator-assignment": "warn",
      "object-shorthand": "warn",
      "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
      "prefer-const": "error",
      "prefer-exponentiation-operator": "error",
      "prefer-named-capture-group": "warn",
      "prefer-numeric-literals": "error",
      "prefer-object-spread": "error",
      "prefer-promise-reject-errors": ["error", { allowEmptyReject: false }],
      "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
      "prefer-spread": "error",
      "prefer-template": "error",
      "require-await": "error",
      "require-unicode-regexp": "warn",
      "symbol-description": "warn",

      "no-alert": "error",
      "no-array-constructor": "error",
      "no-bitwise": "warn",
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
      "no-new-wrappers": "error",
      "no-object-constructor": "error",
      "no-octal-escape": "error",
      "no-param-reassign": "error",
      "no-plusplus": ["warn", { allowForLoopAfterthoughts: true }],
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
            "pipeable",
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
                "pipeable",
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
      "prefer-destructuring": "off",
      "@typescript-eslint/prefer-destructuring": [
        "warn",
        {
          VariableDeclarator: { array: true, object: true },
          AssignmentExpression: { array: false, object: false },
        },
        { enforceForRenamedProperties: true },
      ],
      "@typescript-eslint/sort-type-constituents": "warn",
      "@typescript-eslint/promise-function-async": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "no-use-before-define": "off",
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

      // Security & Correctness
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true },
      ],
      "@typescript-eslint/explicit-module-boundary-types": [
        "warn",
        { allowTypedFunctionExpressions: false },
      ],
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
                "RegExp",
              ],
            },
          ],
        },
      ],
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/prefer-regexp-exec": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
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
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unsafe-unary-minus": "error",

      // === Unicorn ==========================================================
      // (We are assuming that the config is extended by unicorns's:
      // flat/recommended extension)

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
    files: ["*.config.js"],
    rules: {
      "unicorn/filename-case": "off",
    },
  },
  {
    files: ["src/type-fest/**/*.ts"],
    rules: {
      // Type-fest uses a lot of "banned" types...
      "@typescript-eslint/ban-types": "off",
      "unicorn/filename-case": "off",
    },
  },
  {
    files: ["src/**/*.test.ts"],
    rules: {
      "unicorn/no-array-callback-reference": "off",
      "unicorn/no-null": "off",
      "unicorn/no-useless-undefined": [
        "warn",
        { checkArguments: false, checkArrowFunctionBody: false },
      ],
    },
  },
  {
    files: ["test/**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-null": "off",
    },
  },
  {
    files: ["src/_*.ts"],
    rules: {
      // Skip some JSDoc rules for internal-only functions:
      "jsdoc/check-param-names": "off",
      "jsdoc/no-restricted-syntax": "off",
      "jsdoc/require-example": "off",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "off",
    },
  },
);
