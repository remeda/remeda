import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      include: ["src/**"],
      exclude: [
        "src/**/*.bench.ts",
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
      {
        extends: true,
        test: {
          name: "bench",
          include: [],
          // Runs in the benchmark file's own module graph, so the lazy call
          // sites are already in their realistic, generic state when the first
          // benchmark starts. See the module for what that is worth.
          setupFiles: ["./test/benchPollution.ts"],
          benchmark: { include: ["src/**/*.bench.ts"] },
        },
      },
    ],
  },
});
