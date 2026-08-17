import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**"],
      exclude: [
        "src/**/*.test-d.ts",
        "src/**/*.test-prop.ts",
        "src/index.ts",
        "src/internal/types/**/*.ts",
      ],
    },
    projects: [
      {
        resolve: {
          alias: {
            // Allow us to import utilities directly from "remeda" so we can
            // write copy-pasteable reference implementations in our test files
            // (e.g., like the ones for mimicking lodash-like `debounce` and
            // `throttle` functions).
            // @see https://github.com/remeda/remeda/pull/1419
            remeda: fileURLToPath(new URL("src/index.ts", import.meta.url)),
          },
        },
        test: {
          name: "runtime",
          include: ["src/**/*.test.ts"],
          isolate: false,
        },
      },
      {
        test: {
          name: "types",
          include: ["src/**/*.test-d.ts"],
          typecheck: {
            enabled: true,
            only: true,
            ignoreSourceErrors: true,
          },
        },
      },
      {
        test: {
          name: "prop",
          include: ["src/**/*.test-prop.ts"],
          isolate: false,
        },
      },
    ],
  },
});
