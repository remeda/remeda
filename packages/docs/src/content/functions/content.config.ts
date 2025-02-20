import { internalPackageDir } from "@/lib/typedoc/internal-package-dir";
import { typedocLoader } from "@/lib/typedoc/loader";
import { zFunction } from "@/lib/typedoc/schema";
import { defineCollection } from "astro:content";
import path from "node:path";
import { OptionDefaults } from "typedoc";

const LIBRARY_DIR = await internalPackageDir("@remeda/library");

export const functionsCollectionName = "functions";

export const functionsCollection = defineCollection({
  loader: typedocLoader({
    tsconfig: path.join(LIBRARY_DIR, "tsconfig.json"),
    entryPoints: [path.join(LIBRARY_DIR, "src", "index.ts")],

    jsDocCompatibility: {
      exampleTag: false,
    },

    blockTags: [
      ...OptionDefaults.blockTags,
      "@dataFirst",
      "@dataLast",
      "@lazy",
      "@signature",
    ],

    sourceLinkTemplate: "https://github.com/remeda/remeda/blob/main/{path}",
  }),

  schema: zFunction,
});
