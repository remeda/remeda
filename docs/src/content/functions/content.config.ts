import { file } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";
import path from "node:path";
import { isNullish, map, piped, prop, when } from "remeda";
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
      // TODO: This mapping doesn't *do* anything. It's only used to cast the items within the array so that astro accepts them as content datums. There might be a better way around this issue.
      map((reflection) => reflection as unknown as Record<string, unknown>),
    ),
  }),

  schema: z.object({
    id: z.number(),
    kind: z
      .number()
      .refine((kind): kind is ReflectionKind => kind in ReflectionKind),
    name: z.string(),
    sources: z.array(z.object({ url: z.string().url() })),
    signatures: z.array(zSignature),
  }),
});

export const categoriesCollectionName = "functionCategories";

export const categoriesCollection = defineCollection({
  loader: file(DATA_FILE, {
    parser: piped(
      ($) => JSON.parse($) as JSONOutput.ProjectReflection,
      prop("categories"),
      when(isNullish, () => {
        throw new Error(`Data file ${DATA_FILE} is missing any categories`);
      }),
      // TODO: This mapping doesn't *do* anything. It's only used to cast the items within the array so that astro accepts them as content datums. There might be a better way around this issue.
      map((reflection) => reflection as unknown as Record<string, unknown>),
    ),
  }),

  schema: z
    .object({
      title: z.string(),
      children: z.array(reference(functionsCollectionName)),
    })
    .strict(),
});
