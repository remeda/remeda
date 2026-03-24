import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import { functionsCollectionName } from "../functions/content.config";

export const mappingCollectionName = "mapping";

export const mappingCollection = defineCollection({
  loader: glob({
    base: import.meta.dirname,
    pattern: "**/[^_]*.md",
    // We treat the file name as the function name, and function names are case-
    // sensitive, but the default ID generator lowers the case.
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),

  schema: z
    .object({
      category: z.string().min(1),
      remeda: reference(functionsCollectionName).optional(),
    })
    .strict()
    .readonly(),
});
