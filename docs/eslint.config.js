import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".astro",
      "build",
      "dist",
      "node_modules",
      "public",
      "src/content",
      "src/data",
      "src/env.d.ts",
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- react don't export types :(
  eslintPluginReact.configs.flat.recommended,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access -- react don't export types :(
  eslintPluginReact.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.strict,
  eslintPluginUnicorn.configs["flat/recommended"],
  eslintConfigPrettier,

  {
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- react don't export types :(
      "react-hooks": reactHooks,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- react don't export types :(
    rules: reactHooks.configs.recommended.rules,
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },

    rules: {
      "unicorn/prevent-abbreviations": "off",
      "unicorn/switch-case-braces": ["error", "avoid"],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],

      // We stay consistent with the main project on this...
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
    },
  },
  {
    // These are shadcn files, we don't want to meddle with them too much...
    files: ["src/components/ui/*.tsx"],
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off",
      "react/prop-types": "off",
      "jsx-a11y/heading-has-content": "off",
    },
  },
);
