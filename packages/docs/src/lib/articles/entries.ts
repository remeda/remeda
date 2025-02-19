import type { NavbarCategory } from "@/components/navbar";
import { docsArticlesCollectionName } from "@/content/docs-articles/content.config";
import { getCollection } from "astro:content";
import path from "node:path";
import {
  entries,
  groupBy,
  isShallowEqual,
  map,
  pipe,
  piped,
  prop,
  sortBy,
} from "@remeda/library";
import { sortByCategories } from "../sort-categories";

// Matches a slash a the beginning or end of a string.
const EDGE_SLASHES_RE = /^\/|\/$/g;

export const getArticles = async (pathname: string) =>
  pipe(
    await getCollection(
      docsArticlesCollectionName,
      piped(
        prop("id"),
        ($) => path.dirname($),
        isShallowEqual(pathname.replaceAll(EDGE_SLASHES_RE, "")),
      ),
    ),
    map((entry) => ({
      ...entry,
      // The ID contains the path so we can determine on what page to show the
      // article, but we use the filename itself as the slug for the URLs.
      slug: path.basename(entry.id),
    })),
    sortBy(({ data: { priority = Infinity } }) => priority),
    groupBy(({ data: { category } }) => category),
    entries(),
    sortByCategories(),
  );

export const forNavbar = (
  result: Awaited<ReturnType<typeof getArticles>>,
): ReadonlyArray<NavbarCategory> =>
  map(
    result,
    ([category, articles]) =>
      [
        category,
        map(articles, ({ slug, data: { title } }) => ({ title, slug })),
      ] as const,
  );
