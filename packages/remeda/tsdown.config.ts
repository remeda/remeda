import { defineConfig } from "tsdown";

// We split the build into two steps because types and runtime have very
// different concerns. To optimize bundle size we need the runtime artifacts
// (JS) to be as small as possible so that it plays nicely with tree-shaking.
// Types, on the other hand, benefit from being a monolithic file with all
// definitions needed to work with the library. This is also crucial in
// enabling projects using to re-export Remeda types.
// @see https://github.com/remeda/remeda/issues/1175
export default defineConfig({
  // We use the barrel file so that the result is a single monolithic file.
  entry: "src/index.ts",

  // TODO [>2]: Remove CJS support?
  format: ["esm", "cjs"],

  // We support both client and server envs.
  platform: "neutral",

  dts: {
    // This enables "Go to Definition"-style features within IDEs.
    sourcemap: true,

    // Inline types we use from external dependencies (type-fest) so that users
    // don't need to depend on a specific version of type-fest to make our types
    // work.
    resolve: true,

    // Only emit DTS files, skip JS output
    emitDtsOnly: true,
  },

  failOnWarn: true,

  //! The order we do the build is important. This config which handles types
  //! still generates runtime files too, so the runtime build **has** to run
  //! after it so that it can rewrite the barrel files correctly.
  onSuccess: "tsdown --config tsdown.runtime.config.ts",
});
