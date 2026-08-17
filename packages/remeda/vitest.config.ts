import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
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
        extends: true,
        test: {
          name: "runtime",
          include: ["src/**/*.test.ts"],
          isolate: false,
        },
      },
      {
        extends: true,
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
        extends: true,
        test: {
          name: "prop",
          include: ["src/**/*.test-prop.ts"],
          isolate: false,
        },
      },
    ],
  },
});
