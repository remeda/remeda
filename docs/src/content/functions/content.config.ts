import { zFunction } from "@/lib/typedoc/schema";
import { defineCollection } from "astro:content";
import { functionsLoader } from "./loaders";

export const functionsCollectionName = "functions";

export const functionsCollection = defineCollection({
  loader: functionsLoader,
  schema: zFunction,
});
