import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".astro/**", "dist", "public"],
  },

  eslint.configs.recommended,

  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.ts{,x}", "**/*.js{,x}"],
    languageOptions: {
      parserOptions: {
        // modern typescript parser support for type-aware rules
        projectService: true,
      },
    },
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },

      parserOptions: {
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

      // We stay consistent with the main project on this...
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
    },
  },

  {
    ...eslintPluginUnicorn.configs.recommended,
    rules: {
      ...eslintPluginUnicorn.configs.recommended.rules,
      "unicorn/switch-case-braces": ["error", "avoid"],
      "unicorn/prevent-abbreviations": "off",
    },
  },

  {
    // React Components
    files: ["**/*.tsx"],

    plugins: {
      react: eslintPluginReact,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- The types defined in the plugin aren't accurate! We need to trust the docs instead */
      ...eslintPluginReact.configs.flat.all!.rules,
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- The types defined in the plugin aren't accurate! We need to trust the docs instead */
      ...eslintPluginReact.configs.flat["jsx-runtime"]!.rules,
      ...reactHooks.configs["recommended-latest"].rules,
      ...jsxA11y.flatConfigs.strict.rules,

      // We use TypeScript
      "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],

      // Tiny components that are just extracted for clarity or reuse are less
      // readable when they are extracted out of context.
      "react/no-multi-comp": ["error", { ignoreStateless: true }],

      // Makes reading components easier because props are consistent.
      "react/jsx-sort-props": [
        "warn",
        {
          reservedFirst: true,
          shorthandFirst: true,
          multiline: "last",
          callbacksLast: true,
        },
      ],

      // Not relevant to us
      "react/forbid-component-props": "off",
      "react/jsx-no-literals": "off",
      "react/jsx-max-depth": "off",
      "react/require-default-props": "off",
      "react/jsx-props-no-spreading": "off",
    },
  },

  {
    // These are shadcn files, we don't want to meddle with them too much...
    files: ["src/components/ui/*.tsx"],
    rules: {
      "react/jsx-sort-props": "off",
      "react/prefer-read-only-props": "off",
    },
  },

  ...eslintPluginAstro.configs["flat/recommended"],
  ...eslintPluginAstro.configs["jsx-a11y-strict"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        // projectService isn't supported for astro linting, use this instead
        project: true,
      },
    },
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

  // Must be last
  eslintConfigPrettier,
);
