import fs from "node:fs/promises";
import path from "node:path";
import { filter, pipe, pullObject } from "remeda";
import { defineConfig, resolveConfig } from "vite";
import astroConfig from "./astro.config.mjs";

const SOURCE_DIRECTORY = "src/scripts";
const OUTPUT_DIR = "dist/scripts";

// This is not the main vite config for the astro project! It uses vite because
// it already comes bundled with astro to build our scripts folder so they can
// be imported and run **before page load** in our project. You would rarely
// need this.
export default defineConfig({
  build: {
    rollupOptions: {
      input: await getSourceFiles(SOURCE_DIRECTORY),

      output: {
        dir: await getPublicDirectory(OUTPUT_DIR),
        entryFileNames: "[name].js",
      },
    },
  },

  // Disable the publicDir for the scripts because we aren't really building a
  // server here and the name clash makes vite unhappy (very unhappy!).
  publicDir: false,
});

async function getSourceFiles(
  directory: string,
): Promise<Record<string, string>> {
  const sourceDir = path.resolve(import.meta.dirname, directory);
  // @ts-expect-error [ts2322] - TODO: Our typing for pullObject (and fromKeys!) make the results Partial even for simple records!
  return pipe(
    await fs.readdir(sourceDir),
    filter((fileName) => fileName.endsWith(".ts")),
    pullObject(
      (fileName) => path.basename(fileName, ".ts"),
      (fileName) => path.resolve(sourceDir, fileName),
    ),
  );
}

/**
 * This function ensures that even if the public directory is changed in the
 * astro config we will still output the scripts to the correct location.
 */
async function getPublicDirectory(subDir: string): Promise<string> {
  const { publicDir } = await resolveConfig(
    astroConfig.vite ?? {},
    "build" /* command */,
  );
  return path.resolve(publicDir, subDir);
}
