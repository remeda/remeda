import { getCollection, type CollectionEntry } from "astro:content";

const COLLECTION = "docs-articles";

export const getArticlesForPath = async (
  pathname: string,
): Promise<ReadonlyArray<CollectionEntry<typeof COLLECTION>>> =>
  await getCollection(COLLECTION, ({ id }) =>
    // We rely on our docs content library to mirror our pages structure.
    id.startsWith(pathname.replaceAll(/^\/|\/$/g, "") + "/"),
  );
