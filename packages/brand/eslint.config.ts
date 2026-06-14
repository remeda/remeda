import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist"],
  },

  eslint.configs.recommended,

  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  {
    // These are Node scripts run directly via `node` (which only strips types).
    languageOptions: {
      globals: {
        ...globals.node,
      },

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },

    rules: {
      // Types are stricter than interfaces because they can't be extended via
      // declaration merging, making them immune to some typing edge-cases.
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },

  {
    ...eslintPluginUnicorn.configs.recommended,
    rules: {
      ...eslintPluginUnicorn.configs.recommended.rules,

      // We prefer the "avoid" syntax which isn't the default...
      "unicorn/switch-case-braces": ["error", "avoid"],
    },
  },

  // Must be last
  eslintConfigPrettier,
);
