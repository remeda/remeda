import { getCollection } from "astro:content";
import {
  first,
  groupBy,
  map,
  mapValues,
  pick,
  pipe,
  piped,
  prop,
  sortBy,
  unique,
} from "remeda";
import type { Split } from "type-fest";

const COLLECTION = "mapping";

export type Library = Awaited<ReturnType<typeof getLibraries>>[number];

/**
 * We use the collection itself as the source-of-truth for what libraries we
 * offer migration guides for. As long as there's a directory for a mapping, we
 * will consider that mapping to be available.
 *
 * @returns the list of all libraries with mappings in the collection.
 */
export const getLibraries = async () =>
  pipe(
    await getCollection(COLLECTION),
    map(
      piped(
        prop("id"),
        // TODO: Add split to remeda!
        ($) => $.split("/") as Split<typeof $, "/">,
        first(),
      ),
    ),
    unique(),
  );

export async function getMappingEntries(library: string) {
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
          pick(["name"]),
        ),
      ),
    ),
  );
}

export function mappingUrl(library: Library, name: string): string {
  switch (library) {
    case "lodash":
      return `https://lodash.com/docs/4.17.15#${name}`;

    case "ramda":
      return `https://ramdajs.com/docs/#${name}`;
  }
}
