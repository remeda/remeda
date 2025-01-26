import type { categoriesCollectionName } from "@/content/functions/content.config";
import { getEntries, type CollectionEntry } from "astro:content";
import {
  entries,
  groupBy,
  isArray,
  map,
  mapValues,
  pipe,
  piped,
  sortBy,
} from "remeda";
import type { getArticlesForPath } from "./docs";
import type { SourceTags } from "./get-tags";
import { getTags } from "./get-tags";
import { extractName, extractTags } from "./transform";

type FunctionItem = {
  readonly name: string;
  readonly methods?: ReadonlyArray<SourceTags>;
};

export type CategorizedFunctions = ReadonlyArray<
  readonly [category: string, functions: ReadonlyArray<FunctionItem>]
>;

export async function getNavbarEntries(
  categorized:
    | CategorizedFunctions
    | ReadonlyArray<CollectionEntry<typeof categoriesCollectionName>>,
  collection: Awaited<ReturnType<typeof getArticlesForPath>>,
) {
  const contentEntries = pipe(
    collection,
    groupBy(({ data: { category } }) => category),
    mapValues(
      piped(
        sortBy(({ data: { priority } }) => priority ?? Infinity),
        map(({ slug, data: { title } }) => ({ title, slug })),
      ),
    ),
    entries(),
  );

  const unsorted = await Promise.all(
    categorized.map(async (entry) => {
      if (isArray(entry)) {
        const [id, functions] = entry;

        return [
          id,
          map(functions, ({ name: title, methods }) => ({
            title,
            tags: getTags(methods),
          })),
        ] as const;
      }

      const {
        id,
        data: { children },
      } = entry;

      const functions = await getEntries(children);

      return [
        id,
        map(functions, ({ data }) => ({
          title: extractName(data),
          tags: extractTags(data),
        })),
      ] as const;
    }),
  );

  const functionEntries = sortBy(
    unsorted,
    ([category]) => category === "Deprecated",
    ([category]) => category,
  );

  return [...contentEntries, ...functionEntries];
}
