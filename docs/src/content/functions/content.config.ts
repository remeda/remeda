import { defineCollection, reference, z } from "astro:content";
import { map, pick } from "remeda";
import invariant from "tiny-invariant";
import { Application as TypeDoc, type ProjectReflection } from "typedoc";
import { zEntry } from "./schema";

export const functionsCollectionName = "functions";
export const categoriesCollectionName = "categories";

export const functionsCollection = defineCollection({
  loader: async () =>
    await fromTypeDoc(
      "children",
      map(({ name, ...rest }) => ({
        id: name,
        name,
        ...pick(rest, ["kind", "signatures", "sources"]),
      })),
    ),

  schema: zEntry,
});

export const categoriesCollection = defineCollection({
  loader: async () =>
    await fromTypeDoc(
      "categories",
      map(({ title: id, children }) => ({
        id,
        children: children.map(({ name }) => name),
      })),
    ),

  schema: z
    .object({
      id: z.string(),
      children: z.array(reference(functionsCollectionName)),
    })
    .strict(),
});

async function fromTypeDoc<K extends keyof ProjectReflection, T>(
  key: K,
  extractor: (data: NonNullable<ProjectReflection[K]>) => T,
): Promise<T> {
  const app = await TypeDoc.bootstrapWithPlugins();

  const project = await app.convert();
  invariant(project !== undefined, "Failed to parse project!");

  const val = project[key];
  invariant(val !== undefined, `Parsed project is missing '${key}' data`);

  return extractor(val);
}
