import { defineCollection, reference, z } from "astro:content";
import path from "node:path";
import dataFilePath from "./functions.json?url";
import { categoriesLoader, functionsLoader } from "./loaders";
import { zEntry } from "./schema";

const DATA_FILE = path.join(import.meta.dirname, path.basename(dataFilePath));

export const functionsCollectionName = "functions";
export const categoriesCollectionName = "categories";

export const functionsCollection = defineCollection({
  loader: functionsLoader(DATA_FILE),
  schema: zEntry,
});

export const categoriesCollection = defineCollection({
  loader: categoriesLoader(DATA_FILE),
  schema: z
    .object({
      id: z.string(),
      children: z.array(reference(functionsCollectionName)),
    })
    .strict(),
});
