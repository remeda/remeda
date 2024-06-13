import { getCollection } from "astro:content";
import {
  sortBy,
  pipe,
  groupBy,
  mapValues,
  map,
  pick,
  piped,
  prop,
} from "remeda";

const COLLECTION = "mapping";

export async function getMappingEntries(library: string) {
  const fileNameRegExp = new RegExp(`^${library}/(?<name>.*).mdx?$`, "ui");

  return pipe(
    await getCollection(COLLECTION, ({ id }) => id.startsWith(library)),
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

export function mappingUrl(library: string, name: string): string | undefined {
  switch (library) {
    case "lodash":
      return `https://lodash.com/docs/4.17.15#${name}`;

    case "ramda":
      return `https://ramdajs.com/docs/#${name}`;

    default:
      return;
  }
}
