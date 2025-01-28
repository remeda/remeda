import { defineCollection, reference, z } from "astro:content";
import { zEntry } from "../schema";
import { categoriesLoader, functionsLoader } from "./loaders";

export const functionsV1CollectionName = "functions-v1";
export const categoriesV1CollectionName = "categories-v1";

export const functionsV1Collection = defineCollection({
  loader: functionsLoader,
  schema: zEntry,
});

export const categoriesV1Collection = defineCollection({
  loader: categoriesLoader,
  schema: z
    .object({
      id: z.string(),
      children: z.array(reference(functionsV1CollectionName)),
    })
    .strict(),
});
