import { defineConfig } from "tsup";

export default defineConfig(() => ({
  entry: ["src/index.ts"],

  format: ["cjs", "esm"],

  clean: true,

  // Add types to our bundle, typing is a part of our offering.
  dts: true,

  minify: true,
}));
