import {
  categoriesCollectionName,
  functionsCollectionName,
} from "@/content/functions/content.config";
import { getCollection, getEntries } from "astro:content";
import { addProp, map, pipe } from "remeda";
import { transformFunction } from "./transform";

export type DocumentedFunction = Awaited<
  ReturnType<typeof getFunctions>
>[number][1][number];

export const CATEGORIZED = await getFunctions();

async function getFunctions() {
  const [categories, functions] = await Promise.all([
    getCollection(categoriesCollectionName),
    getCollection(functionsCollectionName),
  ]);

  const allNames = new Set(...map(functions, ({ data: { name } }) => name));

  return await Promise.all(
    map(
      categories,
      async ({ data: { id, children } }) =>
        [
          id,
          pipe(
            await getEntries(children),
            map(({ data }) => transformFunction(data, allNames)),
            map(addProp("category", id)),
          ),
        ] as const,
    ),
  );
}
