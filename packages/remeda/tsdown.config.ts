import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/*.ts",
    // Skip test files
    `!**/*.test{,-d}.ts`,
  ],

  // TODO [>2]: Remove CJS support?
  format: ["esm", "cjs"],

  dts: {
    sourcemap: true,
  },

  // We want to stay generic, not building for node or the browser.
  platform: "neutral",

  minify: true,
});
