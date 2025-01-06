import { name as mappingCollectionName } from "@/content/mapping/content.config";
import { getEntry } from "astro:content";
import invariant from "tiny-invariant";

export async function getMappedEntry(library: string, name: string) {
  const entry = await getEntry(mappingCollectionName, `${library}/${name}`);

  invariant(
    entry !== undefined,
    `No entry for function ${name} in library ${library}`,
  );

  return entry;
}
