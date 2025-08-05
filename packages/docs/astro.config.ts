import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import fs from "node:fs/promises";
import path from "node:path";
import { endsWith, filter, pipe, pullObject } from "remeda";
import {
  build,
  defineConfig as defineViteConfig,
  type PluginOption,
} from "vite";

export default defineConfig({
  site: "https://remedajs.com",

  integrations: [react(), mdx(), sitemap()],

  vite: {
    plugins: [
      // @ts-expect-error [ts2322] -- Based on https://github.com/withastro/astro/issues/14030#issuecomment-3027129338 there are version mismatches with vite 7 which are not solvable until Astro itself is bumped.
      tailwindcss(),
      // @ts-expect-error [ts2322] -- Based on https://github.com/withastro/astro/issues/14030#issuecomment-3027129338 there are version mismatches with vite 7 which are not solvable until Astro itself is bumped.
      staticScriptsPlugin({
        inputDir: "src/scripts",
        outputDir: "public/dist/scripts",
      }),
    ],
  },

  redirects: {
    // TODO: Eventually this could be removed...
    "/v1": "/migrate/v1",
  },
});

/**
 * A simple plugin to run a *separate* build via Vite for static scripts that
 * need to be included by name and loaded by the browser directly.
 *
 * TODO: Ideally this should be it's own package. Once we move to a mono-repo setup we should consider creating a separate package for this so that it could be imported into the config instead of living here!
 */
function staticScriptsPlugin({
  inputDir,
  outputDir,
}: {
  readonly inputDir: string;
  readonly outputDir: string;
}): PluginOption {
  const fullPath = path.resolve(import.meta.dirname, inputDir);

  return {
    name: "static-scripts",

    async buildStart(this) {
      this.debug(`Compiling static scripts to ${outputDir}`);

      const input = pipe(
        await fs.readdir(fullPath),
        filter(endsWith(".ts")),
        pullObject(
          (fileName) => path.basename(fileName, ".ts"),
          (fileName) => path.resolve(fullPath, fileName),
        ),
      );

      for (const path of Object.values(input)) {
        this.info(`Found static script: ${path}`);
      }

      const config = defineViteConfig({
        build: {
          rollupOptions: {
            input,
            output: {
              dir: outputDir,
              entryFileNames: "[name].js",
            },
          },
        },

        // Disable the publicDir for the scripts because we aren't really
        // building a server here and the name clash makes vite unhappy (very
        // unhappy!).
        publicDir: false,
      });

      await build(config);
    },
  };
}
