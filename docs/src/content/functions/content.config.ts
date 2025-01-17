import { file } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";
import path from "node:path";
import { filter, hasAtLeast, isNullish, map, piped, prop, when } from "remeda";
import invariant from "tiny-invariant";
import { ReflectionKind, type JSONOutput } from "typedoc";
import dataFilePath from "./functions.json?url";

const DATA_FILE = path.join(import.meta.dirname, path.basename(dataFilePath));

export type Comment = z.infer<typeof zComment>;
const zComment = z
  .object({
    summary: z.array(
      z.object({ kind: z.enum(["code", "text"]), text: z.string() }).strict(),
    ),
    blockTags: z
      .array(
        z
          .object({
            tag: z.string().startsWith("@"),
            content: z.array(z.object({ text: z.string() })),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type Parameter = z.infer<typeof zParameter>;
const zParameter = z.object({ name: z.string(), comment: zComment.optional() });

export type Signature = z.infer<typeof zSignature>;
const zSignature = z.object({
  type: z.union([
    z.object({ type: z.literal("intrinsic"), name: z.string() }).strict(),
    z.object({
      type: z.enum([
        "array",
        "indexedAccess",
        "intersection",
        "predicate",
        "query",
        "reference",
        "reflection",
        "tuple",
        "union",
      ]),
    }),
  ]),
  comment: zComment,
  parameters: z.array(zParameter).optional(),
});

export const functionsCollectionName = "functions";

export const functionsCollection = defineCollection({
  loader: file(DATA_FILE, {
    parser: piped(
      ($) => JSON.parse($) as JSONOutput.ProjectReflection,
      prop("children"),
      when(isNullish, () => {
        throw new Error(
          `Data file ${DATA_FILE} is missing any declarations or references`,
        );
      }),
      filter(({ kind }) => kind === ReflectionKind.Function),
      map((entry) => entry as unknown as Record<string, unknown>),
    ),
  }),

  schema: z.object({
    id: z.number(),
    name: z.string(),
    sources: z.array(z.object({ url: z.string().url() })),
    // Zod's array `min` modifier doesn't refine the output type accordingly so we use `refine` with our own `hasAtLeast` instead.
    signatures: z.array(zSignature).refine(hasAtLeast(1)),
  }),
});

export const categoriesCollectionName = "categories";

export const categoriesCollection = defineCollection({
  loader: file(DATA_FILE, {
    parser: piped(
      ($) => JSON.parse($) as JSONOutput.ProjectReflection,
      prop("categories"),
      when(isNullish, () => {
        throw new Error(`Data file ${DATA_FILE} is missing any categories`);
      }),
      map(({ title: id, children }) => {
        invariant(children !== undefined, `Category ${id} has no children?!`);
        // Astro expects reference types to be strings although it allows ids to be `numbers` :(
        return { id, children: map(children, (id) => id.toString()) };
      }),
    ),
  }),

  schema: z
    .object({
      id: z.string(),
      children: z.array(reference(functionsCollectionName)),
    })
    .strict(),
});
