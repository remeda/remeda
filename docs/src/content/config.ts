import { defineCollection, z } from "astro:content";

export const collections = {
  docs: defineCollection({
    type: "content",
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
  }),

  "v1-migration": defineCollection({ type: "content" }),

  mapping: defineCollection({
    type: "content",
    schema: z.object({
      category: z.string().min(1),
      remeda: z.string().min(1).optional(),
    }),
  }),
};
