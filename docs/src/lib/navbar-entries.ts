import { getCollection, type CollectionEntry } from "astro:content";
import { entries, groupBy, map, pipe, sortBy } from "remeda";
import { getTags } from "./get-tags";
import type { SourceTags } from "./transform";

const COLLECTION = "docs";

type FunctionItem = {
  readonly name: string;
  readonly methods?: ReadonlyArray<SourceTags>;
};

export type CategorizedFunctions = Readonly<
  Record<string, ReadonlyArray<FunctionItem>>
>;

export async function getNavbarEntries(
  categorized: CategorizedFunctions,
  collectionQuery: (entry: CollectionEntry<typeof COLLECTION>) => boolean,
) {
  const contentEntries = pipe(
    await getCollection(COLLECTION, collectionQuery),
    groupBy(({ data: { category } }) => category),
    entries(),
    map(
      ([category, docs]) =>
        [
          category,
          pipe(
            docs,
            sortBy(({ data: { priority } }) => priority ?? Infinity),
            map(({ slug, data: { title } }) => ({ title, slug })),
          ),
        ] as const,
    ),
  );

  const functionEntries = pipe(
    categorized,
    entries(),
    map(
      ([category, funcs]) =>
        [
          category,
          map(funcs, ({ name: title, methods }) => ({
            title,
            tags: methods === undefined ? [] : getTags(methods),
          })),
        ] as const,
    ),
    sortBy(
      ([category]) => category === "Deprecated",
      ([category]) => category,
    ),
  );

  return [...contentEntries, ...functionEntries];
}
