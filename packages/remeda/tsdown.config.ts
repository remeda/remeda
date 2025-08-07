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

  // We support both client and server envs
  platform: "neutral",

  minify: true,

  attw: true,
  publint: true,
});
