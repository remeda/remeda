import { functionsCollectionName } from "@/content/functions/content.config";
import { getCollection } from "astro:content";

export const ALL_NAMES = await getAllNames();

async function getAllNames(): Promise<ReadonlySet<string>> {
  const functions = await getCollection(functionsCollectionName);
  return new Set(...functions.map(({ data: { name } }) => name));
}
