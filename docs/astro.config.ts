import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import fs from "node:fs/promises";
import path from "node:path";
import { filter, pipe, pullObject } from "remeda";
import { build, defineConfig as defineViteConfig } from "vite";

const SOURCE_DIRECTORY = "src/scripts";
const OUTPUT_DIR = "public/dist/scripts";

export default defineConfig({
  site: "https://remedajs.com",

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap(),
  ],

  vite: {
    plugins: [
      {
        name: "build-scripts",
        apply: "build",
        buildStart: async () => {
          await build(
            defineViteConfig({
              build: {
                rollupOptions: {
                  input: await getSourceFiles(SOURCE_DIRECTORY),
                  output: {
                    dir: OUTPUT_DIR,
                    entryFileNames: "[name].js",
                  },
                },
              },

              // Disable the publicDir for the scripts because we aren't really building a
              // server here and the name clash makes vite unhappy (very unhappy!).
              publicDir: false,
            }),
          );
        },
      },
    ],
  },
});

async function getSourceFiles(
  directory: string,
): Promise<Record<string, string>> {
  const sourceDir = path.resolve(import.meta.dirname, directory);
  return pipe(
    await fs.readdir(sourceDir),
    filter((fileName) => fileName.endsWith(".ts")),
    pullObject(
      (fileName) => path.basename(fileName, ".ts"),
      (fileName) => path.resolve(sourceDir, fileName),
    ),
  );
}
