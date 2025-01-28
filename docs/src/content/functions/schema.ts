import { z } from "astro:content";
import { constant, hasAtLeast, startsWith } from "remeda";
import { ReflectionKind } from "typedoc";

export type BlockTag = z.infer<typeof zBlockTag>;
const zBlockTag = z.object({
  tag: z.string().startsWith("@").refine(startsWith("@")),
  content: z.array(z.object({ text: z.string() })),
  // Only v1 data has tags with a `name` prop, this might be a legacy
  // thing that typedoc doesn't do anymore, prefer to avoid using this
  // in the code.
  name: z.string().optional(),
});

const zComment = z.object({
  summary: z.array(
    z.object({ kind: z.enum(["code", "text"]), text: z.string() }).strict(),
  ),
  blockTags: z.array(zBlockTag).optional(),
});

export type Signature = z.infer<typeof zSignature>;
const zSignature = z.object({
  type: z.discriminatedUnion("type", [
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
  ]),
  comment: zComment,
  parameters: z
    .array(z.object({ name: z.string(), comment: zComment.optional() }))
    .optional(),
});

export type FunctionEntry = z.infer<typeof zFunction>;
const zFunction = z.object({
  id: z.string(),
  name: z.string(),
  kind: z
    .literal(ReflectionKind.Function)
    .transform(constant("function" as const)),
  sources: z.array(z.object({ url: z.string().url() })),
  // Zod's array `min` modifier doesn't refine the output type accordingly so we use `refine` with our own `hasAtLeast` instead.
  signatures: z.array(zSignature).min(1).refine(hasAtLeast(1)),
});

export const zEntry = z.discriminatedUnion("kind", [
  zFunction,
  // V1 used namespaces to inject properties into functions. This caused the
  // docs to contain these namespace declarations **in addition** to the
  // actual function mapping. To allow parsing the v1 data file we need to
  // support this kind as well.
  z.object({
    id: z.string(),
    name: z.string(),
    kind: z
      .literal(ReflectionKind.Namespace)
      .transform(constant("namespace" as const)),
  }),
]);
