import { defineConfig } from "tsdown";

const SOURCE_DIRECTORY = "src";

export default defineConfig({
  entry: [`${SOURCE_DIRECTORY}/**/*.ts`],

  // TODO [>2]: Remove CJS support?
  format: ["esm", "cjs"],

  // tsdown doesn't detect our typing configuration in package.json so it
  // doesn't enable this by default as usual.
  dts: true,

  // We want to stay generic, not building for node or the browser.
  platform: "neutral",

  minify: true,
});
