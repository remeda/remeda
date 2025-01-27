import type { categoriesCollectionName } from "@/content/functions/content.config";
import type { categoriesV1CollectionName } from "@/content/functions/v1/content.config";
import { getEntries, type CollectionEntry } from "astro:content";
import {
  entries,
  filter,
  groupBy,
  isArray,
  map,
  mapValues,
  pipe,
  piped,
  prop,
  sortBy,
} from "remeda";
import type { getArticlesForPath } from "./docs";
import { extractTags, type SourceTags } from "./tags";

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
    | ReadonlyArray<CollectionEntry<typeof categoriesCollectionName>>
    | ReadonlyArray<CollectionEntry<typeof categoriesV1CollectionName>>,
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
        return [id, map(functions, ({ name: title }) => ({ title }))] as const;
      }

      const {
        id,
        data: { children },
      } = entry;

      const functions = await getEntries(children);

      return [
        id,
        pipe(
          functions,
          map(prop("data")),
          filter((x) => x.kind === "function"),
          map(
            ({
              name: title,
              signatures: [
                {
                  comment: { blockTags },
                },
              ],
            }) => ({ title, tags: extractTags(blockTags) }),
          ),
        ),
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
