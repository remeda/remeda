import {
  categoriesCollectionName,
  functionsCollectionName,
} from "@/content/functions/content.config";
import { getCollection, getEntries } from "astro:content";
import { transformFunction } from "./transform";

export const CATEGORIZED = await getFunctions();

async function getFunctions() {
  const [categories, functions] = await Promise.all([
    getCollection(categoriesCollectionName),
    getCollection(functionsCollectionName),
  ]);

  const allNames = new Set(...functions.map(({ data: { name } }) => name));

  return await Promise.all(
    categories.map(async ({ data: { id, children } }) => {
      const categoryFunctions = await getEntries(children);
      return [
        id,
        categoryFunctions.map(({ data }) => transformFunction(data, allNames)),
      ] as const;
    }),
  );
}
