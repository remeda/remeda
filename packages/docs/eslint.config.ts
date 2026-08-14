import eslintReact from "@eslint-react/eslint-plugin";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11yX from "eslint-plugin-jsx-a11y-x";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [".astro/**", "dist", "public"],
  },

  eslint.configs.recommended,

  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        ...globals.astro,
      },

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },

    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },

  {
    ...eslintPluginUnicorn.configs.recommended,
    rules: {
      ...eslintPluginUnicorn.configs.recommended.rules,

      // Not useful!
      "unicorn/max-nested-calls": "off",
      "unicorn/name-replacements": "off",

      // We prefer the "avoid" syntax which isn't the default...
      "unicorn/switch-case-braces": ["error", "avoid"],

      // We prefer the single-line comment style which isn't the default...
      "unicorn/single-line-block-comment-style": ["error", "single-line"],
    },
  },

  reactHooks.configs.flat["recommended-latest"],
  {
    // React Components
    files: ["**/*.tsx"],

    extends: [eslintReact.configs["strict-type-checked"]],

    plugins: {
      "jsx-a11y-x": jsxA11yX,
    },

    rules: {
      ...jsxA11yX.configs.strict.rules,

      // ESLint React mirrors several rules of the official React ESLint plugin
      // (e.g. `exhaustive-deps` and `rules-of-hooks`); when both are enabled
      // every violation is reported twice. We prefer the React team's
      // implementations, so the mirrored copies are disabled.
      ...Object.fromEntries(
        Object.keys(reactHooks.rules).map((ruleName) => [
          `@eslint-react/${ruleName}`,
          "off",
        ]),
      ),
    },
  },

  eslintPluginAstro.configs["flat/recommended"],
  // TODO [eslint-plugin-astro@>3.1.0]: If astro's a11y configs support `eslint-plugin-jsx-a11y-x` (https://github.com/ota-meshi/eslint-plugin-astro/issues/565), switch to it and drop `eslint-plugin-jsx-a11y` (only these configs consume it) and its root `eslint` override.
  // TODO [eslint-plugin-jsx-a11y@>6.10.2]: If this release ships native ESLint 10 support (https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/1075), drop its `eslint` override in the root package.json. Until then the override's version range must match the `eslint` range in the workspace package.jsons: when they diverge npm can hoist the override's (older) copy to the root node_modules, where other hoisted plugins bind to it and break on cross-version rule metadata (e.g. eslint-plugin-unicorn wrapping core rules whose `defaultOptions` only exist in newer ESLint).
  eslintPluginAstro.configs["jsx-a11y-strict"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        // When we lint TypeScript within Astro files it's done with the old
        // TypeScript parser which doesn't support `projectService` and requires
        // `project` instead.
        project: true,
        projectService: false,
      },
    },
    // TODO [eslint-plugin-astro@>3.1.0]: astro-eslint-parser reads `ts.JsxEmit.Preserve`, which TypeScript 7's JS API doesn't expose, so every `.astro` file fails parsing with "Cannot read properties of undefined (reading 'Preserve')". This is one of the reasons `typescript` is held back to `^6.0.2` across the repo (typescript-eslint's peer range and tsdown's dts generation are the others); retest with TypeScript 7 when a newer parser ships.
    rules: {
      // Possible Errors
      "astro/no-exports-from-components": "error",

      // Security rules
      "astro/no-set-html-directive": "error",

      // Best Practices
      "astro/no-set-text-directive": "warn",
      "astro/no-unused-css-selector": "warn",

      // Stylistic Issues
      "astro/prefer-class-list-directive": "warn",
      "astro/prefer-object-class-list": "warn",
      "astro/prefer-split-class-list": "warn",
      "astro/sort-attributes": "warn",
    },
  },

  {
    // The base layout is mainly raw HTML, and some rules just don't work well
    // for those cases.
    files: ["src/layouts/base.astro"],
    rules: {
      "astro/sort-attributes": "off",
      "unicorn/text-encoding-identifier-case": "off",
    },
  },

  // Must be last
  eslintConfigPrettier,
);
