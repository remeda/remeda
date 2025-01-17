/* eslint-disable unicorn/no-array-callback-reference */

import type {
  Comment,
  functionsCollectionName,
  Parameter,
  Signature,
} from "@/content/functions/content.config";
import type { InferEntrySchema } from "astro:content";
import { hasAtLeast, uniqueBy } from "remeda";
import { hasDefinedProp, type SetDefined } from "./has-defined-prop";

export type FunctionSignature = ReturnType<typeof transformSignature>;
export type FunctionParam = ReturnType<typeof getParameter>;
export type FunctionReturn = ReturnType<typeof transformReturns>;

export type SourceTags = Readonly<
  Partial<Record<"pipeable" | "strict" | "indexed" | "lazy", boolean>>
>;

export function transformFunction(
  {
    id,
    name,
    sources: [source],
    signatures,
  }: InferEntrySchema<typeof functionsCollectionName>,
  functionNames: ReadonlySet<string>,
) {
  const signaturesWithComments = signatures.filter(hasDefinedProp("comment"));
  if (!hasAtLeast(signaturesWithComments, 1)) {
    return;
  }

  const [
    {
      comment: { summary },
    },
  ] = signaturesWithComments;

  const description =
    summary.length === 0
      ? undefined
      : summary
          .map(({ kind, text }) => {
            if (kind !== "code") {
              return text;
            }

            const codeContent = text.slice(1, -1);
            if (!functionNames.has(codeContent)) {
              return text;
            }

            // If this is a function name, link to its anchor:
            return `[${text}](#${codeContent})`;
          })
          .join("");

  const methods = uniqueBy(
    signaturesWithComments.map(transformSignature),
    ({ signature }) => signature,
  );

  return { id, name, description, methods, sourceUrl: source?.url };
}

const transformSignature = ({
  comment,
  parameters,
  type,
}: SetDefined<Signature, "comment">) =>
  ({
    tag: hasTag(comment.blockTags, "dataFirst")
      ? "Data First"
      : hasTag(comment.blockTags, "dataLast")
        ? "Data Last"
        : undefined,
    signature: tagContent(comment.blockTags, "signature"),
    example: tagContent(comment.blockTags, "example"),
    lazy: hasTag(comment.blockTags, "lazy"),
    args:
      parameters?.map(({ name, comment }) => getParameter(name, comment)) ?? [],
    returns: transformReturns(type, comment.blockTags),
  }) as const;

const transformReturns = (
  type: Signature["type"],
  blockTags: Comment["blockTags"],
) =>
  ({
    name:
      type.type === "intrinsic"
        ? type.name
        : type.type === "array"
          ? "Array"
          : type.type === "predicate"
            ? "boolean"
            : "Object",
    description: tagContent(blockTags, "returns"),
  }) as const;

function getParameter(name: string, comment: Parameter["comment"]) {
  const summarySegments = comment?.summary ?? [];
  const description =
    summarySegments.length === 0
      ? undefined
      : summarySegments.map(({ text }) => text).join("");
  return { name, description } as const;
}

const hasTag = (blockTags: Comment["blockTags"], tagName: string): boolean =>
  blockTags?.some(({ tag }) => tag === `@${tagName}`) ?? false;

function tagContent(
  blockTags: Comment["blockTags"],
  tagName: string,
): string | undefined {
  const tag = blockTags?.find(({ tag }) => tag === `@${tagName}`);

  if (tag === undefined) {
    return;
  }

  const { content } = tag;
  if (content.length === 0) {
    return undefined;
  }

  return content.map(({ text }) => text).join("");
}
