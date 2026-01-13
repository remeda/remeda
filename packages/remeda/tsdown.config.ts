/* eslint-disable no-console -- Allows tracing the build process. */

import { glob, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  build,
  defineConfig,
  type RolldownChunk,
  type UserConfig,
} from "tsdown";

const SOURCE_DIR = "src";

const SHARED = {
  // TODO [>2]: Remove CJS support?
  format: ["esm", "cjs"],

  // We support both client and server envs.
  platform: "neutral",

  failOnWarn: true,
} satisfies UserConfig;

const DECLARATION_FILE_RE = /\.d\.c?ts$/u;

// Typescript type definitions assuming they don't contain an inline comment
// with a semicolon.
const TYPE_DEF_RE = /^type [^;]+;/mu;

// Matches the insertion point at the end of the main export statement.
const EXPORTS_INSERTION_POINT_RE = /(?<=export \{ [^}]+)(?= \};)/u;

// @see `injectAdditionalTypeDeclarations`
const INTERNAL_SYMBOLS = [
  // From `isEmptyish`:
  "EMPTYISH_BRAND",
  // From `hasSubObject`:
  "HAS_SUB_OBJECT_BRAND",
  // From `RemedaTypeError`:
  "RemedaErrorSymbol",

  // From type-fest:
  "emptyObjectSymbol",
  "tag",
];

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
    "build:done": injectAdditionalTypeDeclarations,
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

/**
 * To work around some of the limitations of tsdown type declaration build
 * process in order to enable additional functionality for the library we need
 * to perform additional manual mutations to the generated declaration files.
 *
 * See the comments inline to learn more about the different mutations we apply
 * and the reasoning behind them.
 */
async function injectAdditionalTypeDeclarations({
  chunks,
}: {
  readonly chunks: readonly RolldownChunk[];
}): Promise<void> {
  if (INTERNAL_SYMBOLS.length === 0) {
    throw new Error("No internal symbols defined to export");
  }
  console.log(
    `Externalizing ${INTERNAL_SYMBOLS.length.toString()} internal symbols.`,
  );

  const polyfills = await getTypePolyfills(`${SOURCE_DIR}/internal/types`);
  if (polyfills.length === 0) {
    throw new Error("No type polyfills were found to inject");
  }
  console.log(`Injecting ${polyfills.length.toString()} type polyfills.`);

  await Promise.all(
    chunks
      .filter(({ fileName }) => DECLARATION_FILE_RE.test(fileName))
      .map(async ({ outDir, fileName }) => {
        const file = path.join(outDir, fileName);
        const content = await readFile(file, "utf8");

        // Inject type polyfills at the top of each .d.ts file so that users on
        // older TypeScript versions can use the library.
        const withPolyfills = `//POLYFILLS:\n${polyfills.join("\n")}\n\n${content}`;

        // Projects which have the TypeScript `declaration` setting enabled (or
        // `composite`, which enables it by default) need our internal symbols
        // to be exported so that TypeScript can serialize the types when they
        // are re-exported.
        // @see https://github.com/remeda/remeda/issues/1248
        // @see https://github.com/remeda/remeda/issues/1175
        const withSymbols = withPolyfills.replace(
          EXPORTS_INSERTION_POINT_RE,
          `, ${INTERNAL_SYMBOLS.join(", ")}`,
        );
        if (withSymbols === withPolyfills) {
          throw new Error(`Could not find exports statement in: ${file}`);
        }

        await writeFile(file, withSymbols);
        console.log(
          `Updated type declarations: ${file}. ${(
            withSymbols.length - content.length
          ).toString()} bytes added.`,
        );
      }),
  );
}

/**
 * Dynamically find the polyfills based on declaration files in a given
 * directory.
 */
export async function getTypePolyfills(
  directory: string,
): Promise<readonly string[]> {
  const polyfills: string[] = [];

  for await (const file of glob(`${directory}/*.d.ts`)) {
    const content = await readFile(file, "utf8");
    // We use a regex to extract the actual definition to allow files to also
    // contain comments explaining the polyfill.
    const match = TYPE_DEF_RE.exec(content);
    if (match === null) {
      throw new Error(
        `Could not extract type definition from polyfill file: ${file}`,
      );
    }

    polyfills.push(match[0]);
  }

  return polyfills;
}
