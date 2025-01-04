import { getCollection } from "astro:content";
import {
  entries,
  groupBy,
  map,
  mapValues,
  pick,
  pipe,
  piped,
  prop,
  sortBy,
} from "remeda";
import type { CategorizedFunctions } from "./navbar-entries";

const COLLECTION = "mapping";

export async function getMappingEntries(
  library: string,
): Promise<CategorizedFunctions> {
  const fileNameRegExp = new RegExp(`^${library}/(?<name>.*).mdx?$`, "ui");

  return pipe(
    await getCollection(COLLECTION, ({ id }) => id.startsWith(library)),
    // The files will be sorted by whatever linux considers for ordering, but
    // that makes uppercase and lowercase letters be separated. We want to use
    // a regular "dictionary" style order.
    sortBy(({ id }) => id.toLocaleLowerCase()),
    groupBy(({ data: { category } }) => category),
    mapValues(
      map(
        piped(
          prop("id"),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We trust astro to be consistent with the id format.
          ($) => fileNameRegExp.exec($)!.groups!,
          pick(["name" as const]),
        ),
      ),
    ),
    entries(),
  );
}
