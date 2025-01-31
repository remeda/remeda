import { typedocLoader } from "@/lib/typedoc/loader";
import { zFunction } from "@/lib/typedoc/schema";
import { defineCollection } from "astro:content";
import { OptionDefaults } from "typedoc";

export const functionsCollectionName = "functions";

export const functionsCollection = defineCollection({
  loader: typedocLoader({
    tsconfig: "../tsconfig.json",
    entryPoints: ["../src/index.ts"],

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
