import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    typecheck: {
      enabled: true,
    },
    coverage: {
      include: ["src/**"],
      exclude: ["src/index.ts", "src/**.test-d.ts"],
    },
  },
});
