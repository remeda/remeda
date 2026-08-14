import type { NavbarCategory } from "@/components/navbar";
import { functionsCollectionName } from "@/content/functions/content.config";
import { getCollection } from "astro:content";
import { entries, groupBy, map, pipe } from "remeda";
import invariant from "tiny-invariant";
import { sortByCategories } from "../sort-categories";
import { extractTags, tagContent } from "../tags";

export const getFunctions = async () =>
  pipe(
    await getCollection(functionsCollectionName),
    groupBy(({ data: { name, signatures } }) => {
      const category = tagContent(signatures[0].comment.blockTags, "category");
      invariant(category !== undefined, `Missing category tag on ${name}`);
      return category.toLowerCase();
    }),
    entries(),
    sortByCategories(),
  );

export const forNavbar = (
  result: Awaited<ReturnType<typeof getFunctions>>,
): readonly NavbarCategory[] =>
  map(
    result,
    ([category, functions]) =>
      [
        category,
        map(functions, ({ id: slug, data: { name: title, signatures } }) => ({
          slug,
          title,
          tags: extractTags(signatures[0].comment.blockTags),
        })),
      ] as const,
  );
