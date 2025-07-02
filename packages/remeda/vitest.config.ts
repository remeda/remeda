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
  },
});
