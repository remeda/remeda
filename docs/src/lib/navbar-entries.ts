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

type MappingCategory = readonly [
  category: string,
  functions: ReadonlyArray<{
    readonly name: string;
    readonly methods?: ReadonlyArray<SourceTags>;
  }>,
];

export type MappingCategories = ReadonlyArray<MappingCategory>;

export async function getNavbarEntries(
  categorized:
    | MappingCategories
    | ReadonlyArray<
        CollectionEntry<
          typeof categoriesCollectionName | typeof categoriesV1CollectionName
        >
      >,
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
    map(categorized, async (entry) =>
      isArray(entry)
        ? fromMapping(entry)
        : await fromCategoriesCollection(entry),
    ),
  );

  const functionEntries = sortBy(
    unsorted,
    ([category]) => category === "Deprecated",
    ([category]) => category,
  );

  return [...contentEntries, ...functionEntries];
}

// When entry is an array it is coming from the mapping collections from
// other libraries.
const fromMapping = ([id, functions]: MappingCategory) =>
  [id, map(functions, ({ name: title }) => ({ title }))] as const;

async function fromCategoriesCollection({
  id,
  data: { children },
}: CollectionEntry<
  typeof categoriesV1CollectionName | typeof categoriesCollectionName
>) {
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
}
