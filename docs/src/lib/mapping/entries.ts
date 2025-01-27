import { name as mappingCollectionName } from "@/content/mapping/content.config";
import { getCollection } from "astro:content";
import {
  entries,
  groupBy,
  isNullish,
  last,
  map,
  mapValues,
  objOf,
  pipe,
  sortBy,
  split,
  when,
} from "remeda";
import type { MappingCategories } from "../navbar-entries";

export async function getMappingEntries(
  library: string,
): Promise<MappingCategories> {
  return pipe(
    await getCollection(mappingCollectionName, ({ id }) =>
      id.startsWith(library + "/"),
    ),
    // The files will be sorted by whatever linux considers for ordering, but
    // that makes uppercase and lowercase letters be separated. We want to use
    // a regular "dictionary" style order.
    sortBy(({ id }) => id.toLocaleLowerCase()),
    groupBy(({ data: { category } }) => category),
    mapValues(
      map(({ id }) =>
        pipe(
          id,
          split("/", 2),
          last(),
          when(isNullish, () => {
            throw new Error(`Unexpected content ID for ${library}: ${id}`);
          }),
          objOf("name"),
        ),
      ),
    ),
    entries(),
  );
}
