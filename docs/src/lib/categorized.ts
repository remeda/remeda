import {
  categoriesCollectionName,
  functionsCollectionName,
} from "@/content/functions/content.config";
import { getCollection, getEntries } from "astro:content";
import { addProp, filter, isDefined, map, pipe } from "remeda";
import { transformFunction } from "./transform";

export type DocumentedFunction = Awaited<
  ReturnType<typeof getFunctions>
>[number][1][number];

export const CATEGORIZED = await getFunctions();

async function getFunctions() {
  const [categoryEntries, allFunctionEntries] = await Promise.all([
    getCollection(categoriesCollectionName),
    getCollection(functionsCollectionName),
  ]);

  const allNames = new Set(
    ...map(allFunctionEntries, ({ data: { name } }) => name),
  );

  return await Promise.all(
    map(categoryEntries, async ({ data: { title, children } }) => {
      return [
        title,
        pipe(
          await getEntries(children),
          map(({ data }) => transformFunction(data, allNames)),
          filter(isDefined),
          map(addProp("category", title)),
        ),
      ] as const;
    }),
  );
}
