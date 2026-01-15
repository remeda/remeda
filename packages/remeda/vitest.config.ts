import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**"],
      exclude: [
        "src/**/*.test-d.ts",
        "src/index.ts",
        "src/internal/types/**/*.ts",
      ],
    },
    projects: [
      {
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
    ],
  },
});
