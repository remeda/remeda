import { name as docsArticlesCollectionName } from "@/content/docs-articles/content.config";
import { getCollection, type CollectionEntry } from "astro:content";

// Matches a slash a the beginning or end of a string.
const EDGE_SLASHES_RE = /^\/|\/$/g;

export async function getArticlesForPath(
  pathname: string,
): Promise<ReadonlyArray<CollectionEntry<typeof docsArticlesCollectionName>>> {
  const normalizedPathname = pathname.replaceAll(EDGE_SLASHES_RE, "") + "/";
  return await getCollection(docsArticlesCollectionName, ({ id }) =>
    id.startsWith(normalizedPathname),
  );
}
