import type { NavbarCategory } from "@/components/navbar";
import { categoriesV1CollectionName } from "@/content/functions/v1/content.config";
import { getCollection, getEntries } from "astro:content";
import { map, pipe, prop, filter } from "@remeda/library";
import { extractTags } from "../tags";
import { sortByCategories } from "../sort-categories";

export const getV1Functions = async () =>
  await pipe(
    await getCollection(categoriesV1CollectionName),
    map(
      ({ id: category, data: { children } }) => [category, children] as const,
    ),
    sortByCategories(),
    map(
      async ([category, children]) =>
        [
          category,
          pipe(
            await getEntries(children),
            map(prop("data")),
            // Don't destructure `kind` here! We are relying on TypeScript 5.5's
            // new ability to infer type-predicates to narrow the type of the
            // result.
            // @see https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/#inferred-type-predicates
            filter((x) => x.kind === "function"),
          ),
        ] as const,
    ),
    async ($) => Promise.all($),
  );

export const forNavbar = (
  result: Awaited<ReturnType<typeof getV1Functions>>,
): ReadonlyArray<NavbarCategory> =>
  map(
    result,
    ([category, functions]) =>
      [
        category,
        map(
          functions,
          ({
            name: title,
            signatures: [
              {
                comment: { blockTags },
              },
            ],
          }) => ({ title, tags: extractTags(blockTags) }),
        ),
      ] as const,
  );
