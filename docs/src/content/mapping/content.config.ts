import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";
import { functionsCollectionName } from "../functions/content.config";

export const name = "mapping";

export const collection = defineCollection({
  loader: glob({
    base: import.meta.dirname,
    pattern: "**/[^_]*.md",
    // We treat the file name as the function name, and function names are case-
    // sensitive, but the default ID generator lowers the case.
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),

  schema: z.strictObject({
    category: z.string().min(1),
    remeda: reference(functionsCollectionName).optional(),
  }),
});
