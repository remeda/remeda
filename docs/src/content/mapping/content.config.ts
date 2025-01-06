import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const name = "mapping";

export const collection = defineCollection({
  loader: glob({
    base: import.meta.dirname,
    pattern: "**/[^_]*.md",
    // We treat the file name as the function name, and function names are case-
    // sensitive, but the default ID generator lowers the case.
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),

  schema: z.object({
    category: z.string().min(1),
    remeda: z.string().min(1).optional(),
  }),
});
