import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const LEGACY_CONTENT_ARTICLE_GLOB = "**/[^_]*.md";
const LEGACY_CONTENT_BASE_PATH = "./src/content";

export const collections = {
  "docs-articles": defineCollection({
    loader: glob({
      base: `${LEGACY_CONTENT_BASE_PATH}/docs-articles`,
      pattern: LEGACY_CONTENT_ARTICLE_GLOB,
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
  }),

  "v1-migration": defineCollection({
    loader: glob({
      base: `${LEGACY_CONTENT_BASE_PATH}/v1-migration`,
      pattern: LEGACY_CONTENT_ARTICLE_GLOB,
    }),
  }),

  mapping: defineCollection({
    loader: glob({
      base: `${LEGACY_CONTENT_BASE_PATH}/mapping`,
      pattern: LEGACY_CONTENT_ARTICLE_GLOB,
    }),
    schema: z.object({
      category: z.string().min(1),
      remeda: z.string().min(1).optional(),
    }),
  }),
};
