import { defineCollection, reference, z } from "astro:content";
import { categoriesLoader, functionsLoader } from "./loaders";
import { zFunction } from "@/lib/typedoc/schema";

export const functionsCollectionName = "functions";
export const categoriesCollectionName = "categories";

export const functionsCollection = defineCollection({
  loader: functionsLoader,
  schema: zFunction,
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
