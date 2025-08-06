import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/*.ts",
    // Skip test files
    `!**/*.test{,-d}.ts`,
  ],

  // TODO [>2]: Remove CJS support?
  format: ["esm", "cjs"],

  // tsdown doesn't detect our typing configuration in package.json so it
  // doesn't enable this by default as usual.
  dts: true,

  // We want to stay generic, not building for node or the browser.
  platform: "neutral",

  minify: true,
});
