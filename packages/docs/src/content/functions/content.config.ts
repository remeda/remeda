import { typedocLoader } from "@/lib/typedoc/loader";
import { zFunction } from "@/lib/typedoc/schema";
import { defineCollection } from "astro:content";
import { OptionDefaults } from "typedoc";
import path from "node:path";
import process from "node:process";

const LIBRARY_DIR = path.join(process.cwd(), "..", "library");

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
