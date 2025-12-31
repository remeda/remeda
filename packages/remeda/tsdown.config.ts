import { defineConfig, type UserConfig } from "tsdown";

const SHARED = {
  // TODO [>2]: Remove CJS support?
  format: ["esm", "cjs"],

  // We support both client and server envs
  platform: "neutral",

  // We enforce target at the type-checking level via tsconfig.json. Once we
  // are at the build stage we want to create artifacts which are as close as
  // possible to our source code.
  target: false,

  failOnWarn: true,
} satisfies UserConfig;

export default defineConfig([
  {
    ...SHARED,

    entry: [
      // We use a glob on purpose so that our build creates individual files
      // for each utility function. This will also include the barrel file to
      // allow importing from the main entrypoint.
      "src/*.ts",
      // Skip test files
      `!**/*.test{,-d}.ts`,
    ],

    // We split the build into two steps because types and runtime have very
    // different concerns. To optimize bundle size we need the runtime
    // artifacts (JS) to be as small as possible so that it plays nicely with
    // tree-shaking. Types, on the other hand, benefit from being a monolithic
    // file with all definitions needed to work with the library. This is also
    // crucial to prevent certain edge-cases in more complex projects using
    // Remeda where they want to re-export types based on types coming from
    // Remeda.
    // @see https://github.com/remeda/remeda/issues/1175
    dts: false,

    minify: true,

    // This makes debugging easier, and also makes stack traces more legible.
    sourcemap: true,
  },
  {
    ...SHARED,

    // We use the barrel file so that the result is a single monolithic file.
    entry: "src/index.ts",

    dts: {
      // This allows "Go to Definition"-style features within IDEs to improve
      // the DX when working with Remeda.
      sourcemap: true,

      // Inline external types from dependencies (like type-fest) into the
      // generated .d.ts files.
      resolve: true,

      // Disable emitting any runtime files.
      emitDtsOnly: true,
    },

    // Lint/verify the outputs
    attw: true,
    publint: true,
  },
]);
