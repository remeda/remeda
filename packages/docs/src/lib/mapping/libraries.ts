import { mappingCollectionName } from "@/content/mapping/content.config";
import { getCollection } from "astro:content";
import { hasAtLeast, split } from "@remeda/library";
import invariant from "tiny-invariant";

export async function getAllMappedLibraries(): Promise<ReadonlyArray<string>> {
  const mappings = await getCollection(mappingCollectionName);
  const libraries = new Set<string>();
  for (const { id } of mappings) {
    const parts = split(id, "/");
    invariant(
      parts.length <= 2,
      `Subdirectories are not supported for mappings, got ${id}`,
    );
    invariant(
      hasAtLeast(parts, 2),
      `All mappings should be located under a library directory, got ${id}`,
    );
    libraries.add(parts[0]);
  }
  return [...libraries];
}
