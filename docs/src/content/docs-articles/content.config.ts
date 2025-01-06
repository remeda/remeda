import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const name = "docs-articles";

export const collection = defineCollection({
  loader: glob({
    base: import.meta.dirname,
    pattern: "**/[^_]*.md",
    // The default id takes the file name without the subdirectory which we
    // use to match the content to the correct page.
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),

  schema: z.object({
    /**
     * The slug would be used in the URL. This should be unique.
     */
    slug: z.string().min(1).optional(),

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
