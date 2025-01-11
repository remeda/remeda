import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";
import { ReflectionKind, type JSONOutput } from "typedoc";
import path from "node:path";

const FILENAME = "functions.json";
const PATH = path.join(import.meta.dirname, FILENAME);

export const functionsCollectionName = "functions";

export const SIGNATURE_SCHEMA = z
  .object({
    type: z.union([
      z.object({
        type: z.literal("intrinsic"),
        name: z.string(),
      }),
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
    comment: z.object({
      summary: z.array(
        z.object({
          kind: z.enum(["code", "text"]),
          text: z.string(),
        }),
      ),
      blockTags: z
        .array(
          z.object({
            tag: z.string().startsWith("@"),
            content: z.array(
              z.object({
                text: z.string(),
              }),
            ),
          }),
        )
        .optional(),
    }),
    parameters: z.array(
      z.object({
        name: z.string(),
        comment: z
          .object({
            summary: z.array(
              z.object({
                text: z.string(),
              }),
            ),
          })
          .optional(),
      }),
    ),
  })
  .partial();

export const functionsCollection = defineCollection({
  loader: file(PATH, {
    parser: (text) =>
      (JSON.parse(text) as JSONOutput.ProjectReflection)
        .children as unknown as Record<string, unknown>[],
  }),

  schema: z.object({
    id: z.number(),
    kind: z
      .number()
      .refine((kind): kind is ReflectionKind => kind in ReflectionKind),
    name: z.string(),
    sources: z
      .array(
        z.object({
          url: z.string().url(),
        }),
      )
      .optional(),
    signatures: z.array(SIGNATURE_SCHEMA).optional(),
  }),
});

export const categoriesCollectionName = "functionCategories";

export const categoriesCollection = defineCollection({
  loader: file(PATH, {
    parser: (text) =>
      (JSON.parse(text) as JSONOutput.ProjectReflection)
        .categories as unknown as Record<string, unknown>[],
  }),

  schema: z
    .unknown()
    .refine((_value): _value is JSONOutput.ReflectionCategory => true),
});
