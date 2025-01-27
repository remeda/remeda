import { z } from "astro:content";
import { constant, hasAtLeast } from "remeda";

export type BlockTags = z.infer<typeof zBlockTags>;
const zBlockTags = z.array(
  z
    .object({
      tag: z.string().startsWith("@"),
      content: z.array(z.object({ text: z.string() })),
      // Only v1 data has tags with a `name` prop, this might be a legacy
      // thing that typedoc doesn't do anymore, prefer to avoid using this
      // in the code.
      name: z.string().optional(),
    })
    .strict(),
);

const zComment = z
  .object({
    summary: z.array(
      z.object({ kind: z.enum(["code", "text"]), text: z.string() }).strict(),
    ),
    blockTags: zBlockTags.optional(),
  })
  .strict();

export type SignatureType = z.infer<typeof zSignatureType>;
const zSignatureType = z.union([
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
      // Only v1 data has these types!
      "mapped",
      "conditional",
    ]),
  }),
]);

export type SignatureParameters = z.infer<typeof zParameters>;
const zParameters = z.array(
  z.object({ name: z.string(), comment: zComment.optional() }),
);

export const zEntry = z.intersection(
  z.object({ id: z.number(), name: z.string() }),
  z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal(64).transform(constant("function" as const)),
      sources: z.array(z.object({ url: z.string().url() })),
      // Zod's array `min` modifier doesn't refine the output type accordingly so we use `refine` with our own `hasAtLeast` instead.
      signatures: z
        .array(
          z.object({
            type: zSignatureType,
            comment: zComment,
            parameters: zParameters.optional(),
          }),
        )
        .refine(hasAtLeast(1)),
    }),
    // V1 used namespaces to inject properties into functions. This caused the
    // docs to contain these namespace declarations **in addition** to the
    // actual function mapping. To allow parsing the v1 data file we need to
    // support this kind as well.
    z.object({
      kind: z.literal(4).transform(constant("namespace" as const)),
    }),
  ]),
);
