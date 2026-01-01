import { glob, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { build, defineConfig, type TsdownHooks, type UserConfig } from "tsdown";

const SOURCE_DIR = "src";

const SHARED = {
  // TODO [>2]: Remove CJS support?
  format: ["esm", "cjs"],

  // We support both client and server envs.
  platform: "neutral",

  failOnWarn: true,
} satisfies UserConfig;

/**
 * Inject type polyfills at the top of each .d.ts file so that users on older
 * TypeScript versions can use the library.
 */
const injectPolyfills: TsdownHooks["build:done"] = async ({ chunks }) => {
  const polyfills: Array<string> = [];
  for await (const file of glob(`${SOURCE_DIR}/internal/types/*.d.ts`)) {
    const content = await readFile(file, "utf8");
    // Only include the part starting with a `type` declaration.
    const typeDeclaration = content.slice(content.indexOf("\ntype ") + 1);
    polyfills.push(typeDeclaration);
  }

  const allPolyfills = `//POLYFILLS:\n${polyfills.join("")}`;

  await Promise.all(
    chunks
      .filter(
        ({ fileName }) =>
          fileName.endsWith(".d.ts") || fileName.endsWith(".d.cts"),
      )
      .map(async ({ outDir, fileName }) => {
        const file = path.join(outDir, fileName);
        const content = await readFile(file, "utf8");
        await writeFile(file, allPolyfills + content);
      }),
  );
};

// We split the build into two steps because types and runtime have very
// different concerns. To optimize bundle size we need the runtime artifacts
// (JS) to be as small as possible so that it plays nicely with tree-shaking.
// Types, on the other hand, benefit from being a monolithic file with all
// definitions needed to work with the library. This is also crucial in
// enabling projects using to re-export Remeda types.
// @see https://github.com/remeda/remeda/issues/1175
export default defineConfig({
  ...SHARED,

  // We use the barrel file so that the result is a single monolithic file.
  entry: `${SOURCE_DIR}/index.ts`,

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

  hooks: {
    "build:done": injectPolyfills,
  },

  //! The order we do the build is important. The current config (which handles
  //! types) still generates runtime files too, so the runtime build **has** to
  //! run after it so that it can rewrite the barrel files correctly.
  onSuccess: async () => {
    await build({
      //! Even the programmatic `build` API tries to load the default config
      //! file before merging it with the config provided to it. In our case it
      //! would cause the first step's config to be re-applied here, instead of
      //! each step being isolated from each other. More importantly, loading
      //! our previous config here caused us to enter an infinite loop because
      //! of the `onSuccess` hook!
      config: false,

      ...SHARED,

      // This is the second step which relies on the previous step generating
      // the typing artifacts, and only fills in the gaps with the runtime artifacts.
      clean: false,

      entry: [
        // We use a glob on purpose so that our build creates individual files
        // for each utility function. This also includes the barrel file which
        // is crucial to allow importing directly from the package root, without
        // needing paths within the import statement: e.g.,
        // `import { map } from "remeda";`
        `${SOURCE_DIR}/*.ts`,
        // Skip test files
        `!**/*.test{,-d}.ts`,
      ],

      // We enforce target at the type-checking level via tsconfig.json. Once we
      // are at the build stage we want to create artifacts which are as close
      // as possible to our source code.
      target: false,

      //! Types are built in the previous step!
      dts: false,

      minify: true,

      // This makes debugging easier, and also makes stack traces more legible.
      sourcemap: true,

      // Validate the final package artifacts.
      attw: true,
      publint: true,
    });
  },
});
