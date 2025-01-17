import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";
import { ReflectionKind, type JSONOutput } from "typedoc";
import path from "node:path";

const FILENAME = "functions.json";
const PATH = path.join(import.meta.dirname, FILENAME);

export const functionsCollectionName = "functions";

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

export const functionsCollection = defineCollection({
  loader: file(PATH, {
    parser: (text) =>
      (JSON.parse(text) as JSONOutput.ProjectReflection)
        .children as unknown as Array<Record<string, unknown>>,
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
  loader: file(PATH, {
    parser: (text) =>
      (JSON.parse(text) as JSONOutput.ProjectReflection)
        .categories as unknown as Array<Record<string, unknown>>,
  }),

  schema: z
    .object({ title: z.string(), children: z.array(z.number()) })
    .strict(),
});
