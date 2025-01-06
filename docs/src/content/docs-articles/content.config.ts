import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const name = "docs-articles";

export const collection = defineCollection({
  loader: glob({
    base: import.meta.dirname,
    pattern: "**/[^_]*.md",
  }),

  schema: z.object({
    /**
     * The title would be used in the navbar.
     */
    title: z.string().min(1),

    /**
     * The category for the content. This would be used in the navbar to group
     * the content together.
     */
    category: z.string().min(1),

    /**
     * The priority defines the sorting order *within* the category.
     */
    priority: z.number().nonnegative().int().optional(),
  }),
});
