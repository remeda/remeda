import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const name = "mapping";

export const collection = defineCollection({
  loader: glob({
    base: import.meta.dirname,
    pattern: "**/[^_]*.md",
  }),

  schema: z.object({
    category: z.string().min(1),
    remeda: z.string().min(1).optional(),
  }),
});
