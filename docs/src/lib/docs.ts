import { name as docsArticlesCollectionName } from "@/content/docs-articles/content.config";
import { getCollection, type CollectionEntry } from "astro:content";
import { piped, prop, startsWith } from "remeda";

// Matches a slash a the beginning or end of a string.
const EDGE_SLASHES_RE = /^\/|\/$/g;

export const getArticlesForPath = async (
  pathname: string,
): Promise<ReadonlyArray<CollectionEntry<typeof docsArticlesCollectionName>>> =>
  await getCollection(
    docsArticlesCollectionName,
    piped(
      prop("id"),
      startsWith(pathname.replaceAll(EDGE_SLASHES_RE, "") + "/"),
    ),
  );
