import { typedocLoader } from "@/lib/typedoc/loader";
import { zFunction } from "@/lib/typedoc/schema";
import { defineCollection } from "astro:content";
import { OptionDefaults } from "typedoc";
import path from "node:path";

export const functionsCollectionName = "functions";

// TODO: Use env variables for these!
const PROJECT_ROOT = "../../";
const PACKAGES_DIR = "packages";
const LIB_PACKAGE = "lib";

const LIB_PATH = path.join(PROJECT_ROOT, PACKAGES_DIR, LIB_PACKAGE);

export const functionsCollection = defineCollection({
  loader: typedocLoader({
    tsconfig: `${LIB_PATH}/tsconfig.json`,
    entryPoints: [`${LIB_PATH}/src/index.ts`],

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
