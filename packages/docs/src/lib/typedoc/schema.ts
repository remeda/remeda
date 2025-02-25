import { z } from "astro:content";
import { constant, hasAtLeast, startsWith } from "remeda";
import { ReflectionKind } from "typedoc";

export type BlockTag = z.infer<typeof zBlockTag>;
const zBlockTag = z.object({
  // Zod's string `startsWith` modifier doesn't refine the output type accordingly so we use `refine` with our own `startsWith` too.
  tag: z.string().startsWith("@").refine(startsWith("@")),
  content: z.array(z.object({ text: z.string() })),
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
export const zFunction = z.object({
  name: z.string(),
  kind: z
    .literal(ReflectionKind.Function)
    .transform(constant("function" as const)),
  sources: z.array(z.object({ url: z.string().url() })),
  // Zod's array `min` modifier doesn't refine the output type accordingly so we use `refine` with our own `hasAtLeast` too.
  signatures: z.array(zSignature).min(1).refine(hasAtLeast(1)),
});
