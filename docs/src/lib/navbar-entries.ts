import { entries, groupBy, map, mapValues, pipe, piped, sortBy } from "remeda";
import type { getArticlesForPath } from "./docs";
import { getTags } from "./get-tags";
import type { SourceTags } from "./transform";

type FunctionItem = {
  readonly name: string;
  readonly methods?: ReadonlyArray<SourceTags>;
};

export type CategorizedFunctions = ReadonlyArray<
  readonly [category: string, functions: ReadonlyArray<FunctionItem>]
>;

export function getNavbarEntries(
  categorized: CategorizedFunctions,
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

  const functionEntries = pipe(
    categorized,
    map(
      ([category, functions]) =>
        [
          category,
          map(functions, ({ name: title, methods }) => ({
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
