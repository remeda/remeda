import { defineCollection, reference, z } from "astro:content";
import { zEntry } from "./schema";
import { categoriesLoader, functionsLoader } from "./loaders";

export const functionsCollectionName = "functions";
export const categoriesCollectionName = "categories";

export const functionsCollection = defineCollection({
  loader: functionsLoader,
  schema: zEntry,
});

export const categoriesCollection = defineCollection({
  loader: categoriesLoader,
  schema: z
    .object({
      id: z.string(),
      children: z.array(reference(functionsCollectionName)),
    })
    .strict(),
});
