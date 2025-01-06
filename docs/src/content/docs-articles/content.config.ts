import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const name = "docs-articles";

export const collection = defineCollection({
  loader: glob({
    base: import.meta.dirname,
    pattern: "**/[^_]*.md",
    // We rely on the directory to be part of the ID to determine on which page
    // the article should be rendered on, but the default ID generator uses the
    // slug as the ID if it exists.
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
