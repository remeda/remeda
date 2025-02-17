import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

export const name = "v1-migration";

export const collection = defineCollection({
  loader: glob({
    base: import.meta.dirname,
    pattern: "**/[^_]*.md",
  }),
});
