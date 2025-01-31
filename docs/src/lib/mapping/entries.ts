import type { NavbarCategory } from "@/components/navbar";
import { mappingCollectionName } from "@/content/mapping/content.config";
import { getCollection } from "astro:content";
import {
  entries,
  groupBy,
  hasAtLeast,
  last,
  map,
  pipe,
  piped,
  prop,
  sortBy,
  split,
  when,
} from "remeda";
import { sortByCategories } from "../sort-categories";

export const getMigrationMappings = async (library: string) =>
  pipe(
    await getCollection(mappingCollectionName, ({ id }) =>
      id.startsWith(library + "/"),
    ),
    // The files will be sorted by whatever linux considers for ordering, but
    // that makes uppercase and lowercase letters be separated. We want to use
    // a regular "dictionary" style order.
    sortBy(({ id }) => id.toLocaleLowerCase()),
    groupBy(({ data: { category } }) => category),
    entries(),
    sortByCategories(),
  );

export const migrationMappingNavBarEntries = (
  result: Awaited<ReturnType<typeof getMigrationMappings>>,
): ReadonlyArray<NavbarCategory> =>
  map(
    result,
    ([category, entries]) =>
      [
        category,
        map(
          entries,
          piped(
            prop("id"),
            split("/", 2),
            when(($) => hasAtLeast($, 2), {
              onTrue: ($) => ({ title: last($) }),
              onFalse: ($) => {
                throw new Error(`Unexpected content ID: ${$.join("/")}`);
              },
            }),
          ),
        ),
      ] as const,
  );
