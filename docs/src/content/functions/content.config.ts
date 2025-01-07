import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";
import { JSONOutput } from "typedoc";
import path from "node:path";

const FILENAME = "functions.json";
const PATH = path.join(import.meta.dirname, FILENAME);

export const functionsCollectionName = "functions";

export const functionsCollection = defineCollection({
  loader: file(PATH, {
    parser: (text) =>
      (JSON.parse(text) as JSONOutput.ProjectReflection)
        .children as unknown as Record<string, unknown>[],
  }),

  schema: z
    .unknown()
    .refine((_value): _value is JSONOutput.DeclarationReflection => true),
});

export const categoriesCollectionName = "functionCategories";

export const categoriesCollection = defineCollection({
  loader: file(PATH, {
    parser: (text) =>
      (JSON.parse(text) as JSONOutput.ProjectReflection)
        .categories as unknown as Record<string, unknown>[],
  }),

  schema: z
    .unknown()
    .refine((_value): _value is JSONOutput.ReflectionCategory => true),
});
