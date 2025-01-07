import { entries, groupBy, pipe } from "remeda";
import { transformProject } from "./transform";
import { getCollection } from "astro:content";
import {
  functionsCollectionName,
  categoriesCollectionName,
} from "@/content/functions/content.config";

const MISSING_CATEGORY_FALLBACK = "Other";

const [functions, categories] = await Promise.all([
  getCollection(functionsCollectionName),
  getCollection(categoriesCollectionName),
]);

export const CATEGORIZED = pipe(
  transformProject(
    functions.map(({ data }) => data),
    categories.map(({ data }) => data),
  ),
  groupBy(
    ({ category }) =>
      category ??
      // We should probably throw instead so that the build would fail
      MISSING_CATEGORY_FALLBACK,
  ),
  entries(),
);
