import { typeDocLoader, type TypeDocLoaderOptions } from "@/lib/typedoc/loader";
import { prop } from "remeda";
import invariant from "tiny-invariant";
import { OptionDefaults, Application as TypeDoc } from "typedoc";

const TYPEDOC_OPTIONS = {
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
} satisfies TypeDocLoaderOptions;

export const functionsLoader = typeDocLoader(TYPEDOC_OPTIONS);

export async function categoriesLoader() {
  const app = await TypeDoc.bootstrap(TYPEDOC_OPTIONS);

  const project = await app.convert();
  invariant(project !== undefined, "Failed to parse project!");

  const { categories } = project;

  invariant(
    categories !== undefined,
    `Parsed project is missing categories data`,
  );

  return categories.map(({ title: id, children }) => ({
    id,
    children: children.map(prop("name")),
  }));
}
