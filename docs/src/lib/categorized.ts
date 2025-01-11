import { entries, groupBy, pipe, prop } from "remeda";
import { transformProject } from "./transform";
import { getCollection } from "astro:content";
import {
  functionsCollectionName,
  categoriesCollectionName,
} from "@/content/functions/content.config";

// We should probably throw instead so that the build would fail
const MISSING_CATEGORY_FALLBACK = "Other";

export const CATEGORIZED = pipe(
  await getFunctions(),
  groupBy(({ category = MISSING_CATEGORY_FALLBACK }) => category),
  entries(),
);

async function getFunctions() {
  const [declarationEntries, categoryEntries] = await Promise.all([
    getCollection(functionsCollectionName),
    getCollection(categoriesCollectionName),
  ]);

  const declaration = declarationEntries.map(prop("data"));
  const categories = categoryEntries.map(prop("data"));

  return transformProject(declaration, categories);
}
