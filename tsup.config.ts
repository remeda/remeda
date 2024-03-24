import { defineConfig } from "tsup";

export default defineConfig(() => ({
  entry: ["src/index.ts"],

  format: ["cjs", "esm"],

  clean: true,

  // Add types to our bundle, typing is a part of our offering.
  dts: true,

  // Trying to make our code tree-shakeable, not sure it works...
  splitting: true,
  treeshake: true,
}));
