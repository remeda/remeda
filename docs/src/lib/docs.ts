import { name as docsArticlesCollectionName } from "@/content/docs-articles/content.config";
import { getCollection } from "astro:content";
import path from "node:path";

// Matches a slash a the beginning or end of a string.
const EDGE_SLASHES_RE = /^\/|\/$/g;

export async function getArticlesForPath(pathname: string) {
  const normalizedPathname = pathname.replaceAll(EDGE_SLASHES_RE, "");

  const entries = await getCollection(
    docsArticlesCollectionName,
    ({ id }) => path.dirname(id) === normalizedPathname,
  );

  return entries.map((entry) => ({
    ...entry,
    // The ID contains the path so we can determine on what page to show the
    // article, but we use the filename itself as the slug for the URLs.
    slug: path.basename(entry.id),
  }));
}
