import { defineConfig } from "tsdown";

// This is the second step of our 2-step build process. For the rationale and
// details see the first step in tsdown.config.ts
export default defineConfig({
  // This is the second step which relies on the previous step generating the
  // typing artifacts, and only fills in the gaps with the runtime artifacts.
  clean: false,

  entry: [
    // We use a glob on purpose so that our build creates individual files
    // for each utility function. This also includes the barrel file which is
    // crucial to allow importing directly from the package root, without
    // needing paths within the import statement
    // (e.g. `import { map } from "remeda";`)
    "src/*.ts",
    // Skip test files
    `!**/*.test{,-d}.ts`,
  ],

  // TODO [>2]: Remove CJS support?
  format: ["esm", "cjs"],

  // We support both client and server envs.
  platform: "neutral",

  // We enforce target at the type-checking level via tsconfig.json. Once we
  // are at the build stage we want to create artifacts which are as close as
  // possible to our source code.
  target: false,

  //! Types are built in the previous step!
  dts: false,

  minify: true,

  // This makes debugging easier, and also makes stack traces more legible.
  sourcemap: true,

  failOnWarn: true,

  // Validate the final package artifacts.
  attw: true,
  publint: true,
});
