import { type CollectionEntry } from "astro:content";
import { entries, groupBy, map, pipe, sortBy } from "remeda";
import { getTags } from "./get-tags";
import type { SourceTags } from "./transform";

type FunctionItem = {
  readonly name: string;
  readonly methods?: ReadonlyArray<SourceTags>;
};

export type CategorizedFunctions = Readonly<
  Record<string, ReadonlyArray<FunctionItem>>
>;

export function getNavbarEntries(
  categorized: CategorizedFunctions,
  collection: ReadonlyArray<CollectionEntry<"docs-articles">>,
) {
  const contentEntries = pipe(
    collection,
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
