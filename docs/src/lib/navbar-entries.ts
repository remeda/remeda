import { getCollection, type CollectionEntry } from "astro:content";
import { entries, groupBy, map, pipe, sortBy } from "remeda";
import { getTags } from "./get-tags";
import type { SourceTags } from "./transform";

const COLLECTION = "docs";

type CategoryItem = ReadonlyArray<{
  readonly name: string;
  readonly methods: ReadonlyArray<SourceTags>;
}>;

type Categorized = Readonly<Record<string, CategoryItem>>;

export async function getNavbarEntries(
  categorized: Categorized,
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
            tags: getTags(methods),
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
