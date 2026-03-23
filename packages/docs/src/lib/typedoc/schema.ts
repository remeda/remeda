import { z } from "astro/zod";
import { constant, startsWith } from "remeda";
import { ReflectionKind } from "typedoc";

export type BlockTag = z.infer<typeof zBlockTag>;
const zBlockTag = z
  .object({
    // Zod's string `startsWith` modifier doesn't refine the output type accordingly so we use `refine` with our own `startsWith` too.
    tag: z.string().startsWith("@").refine(startsWith("@")),
    content: z
      .array(
        z
          .object({
            text: z.string(),
          })
          .readonly(),
      )
      .readonly(),
  })
  .readonly();

const zComment = z.object({
  summary: z.array(
    z
      .object({
        kind: z.enum(["code", "text"]),
        text: z.string(),
      })
      .strict()
      .readonly(),
  ),
  blockTags: z.array(zBlockTag).readonly().optional(),
});

export type Signature = z.infer<typeof zSignature>;
const zSignature = z
  .object({
    type: z.discriminatedUnion("type", [
      z
        .object({
          type: z.literal("intrinsic"),
          name: z.string(),
        })
        .strict()
        .readonly(),
      z
        .object({
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
        })
        .readonly(),
    ]),
    comment: zComment,
    parameters: z
      .array(
        z
          .object({
            name: z.string(),
            comment: zComment.optional(),
          })
          .readonly(),
      )
      .readonly()
      .optional(),
  })
  .readonly();

export type FunctionEntry = z.infer<typeof zFunction>;
export const zFunction = z
  .object({
    name: z.string(),
    kind: z.literal(ReflectionKind.Function).transform(constant("function")),
    sources: z
      .array(
        z
          .object({
            url: z.url(),
          })
          .readonly(),
      )
      .readonly(),
    signatures: z.tuple([zSignature], zSignature).readonly(),
  })
  .readonly();
