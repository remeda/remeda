import { zFunction } from "@/lib/typedoc/schema";
import { defineCollection, reference, z } from "astro:content";
import { categoriesLoader, functionsLoader } from "./loaders";
import { ReflectionKind } from "typedoc";
import { constant } from "remeda";

export const functionsV1CollectionName = "functions-v1";
export const categoriesV1CollectionName = "categories-v1";

export const functionsV1Collection = defineCollection({
  loader: functionsLoader,
  schema: z.discriminatedUnion("kind", [
    zFunction,
    // V1 used namespaces to inject properties into functions. This caused the
    // docs to contain these namespace declarations **in addition** to the
    // actual function mapping.
    z.object({
      name: z.string(),
      kind: z
        .literal(ReflectionKind.Namespace)
        .transform(constant("namespace" as const)),
    }),
  ]),
});

export const categoriesV1Collection = defineCollection({
  loader: categoriesLoader,
  schema: z
    .object({
      id: z.string(),
      children: z.array(reference(functionsV1CollectionName)),
    })
    .strict(),
});
