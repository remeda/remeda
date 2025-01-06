import { getCollection, type CollectionEntry } from "astro:content";
import { piped, prop, startsWith } from "remeda";

const COLLECTION = "docs-articles";

// Matches a slash a the beginning or end of a string.
const EDGE_SLASHES_RE = /^\/|\/$/g;

export const getArticlesForPath = async (
  pathname: string,
): Promise<ReadonlyArray<CollectionEntry<typeof COLLECTION>>> =>
  await getCollection(
    COLLECTION,
    piped(
      prop("id"),
      startsWith(pathname.replaceAll(EDGE_SLASHES_RE, "") + "/"),
    ),
  );
