import { defineCollection, reference, z } from "astro:content";
import path from "node:path";
import { categoriesLoader, functionsLoader } from "../loaders";
import { zEntry } from "../schema";
import dataFilePath from "./functions.json?url";

const DATA_FILE = path.join(import.meta.dirname, path.basename(dataFilePath));

export const functionsV1CollectionName = "functions-v1";
export const categoriesV1CollectionName = "categories-v1";

export const functionsV1Collection = defineCollection({
  loader: functionsLoader(DATA_FILE),
  schema: zEntry,
});

export const categoriesV1Collection = defineCollection({
  loader: categoriesLoader(DATA_FILE),
  schema: z
    .object({
      id: z.string(),
      children: z.array(reference(functionsV1CollectionName)),
    })
    .strict(),
});
