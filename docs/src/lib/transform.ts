import type {
  Comment,
  functionsCollectionName,
  Parameter,
  Signature,
} from "@/content/functions/content.config";
import type { InferEntrySchema } from "astro:content";
import { map, pipe, prop, uniqueBy } from "remeda";

export type FunctionSignature = ReturnType<typeof transformSignature>;
export type FunctionParam = ReturnType<typeof getParameter>;
export type FunctionReturn = ReturnType<typeof transformReturns>;

export const transformFunction = (
  {
    id,
    name,
    sources: [source],
    signatures,
  }: InferEntrySchema<typeof functionsCollectionName>,
  functionNames: ReadonlySet<string>,
) => ({
  id,
  name,
  description: getDescription(signatures[0], functionNames),
  methods: pipe(
    signatures,
    map(transformSignature),
    uniqueBy(prop("signature")),
  ),
  sourceUrl: source?.url,
});

const getDescription = (
  { comment: { summary } }: Signature,
  functionNames: ReadonlySet<string>,
) =>
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

const transformSignature = ({ comment, parameters, type }: Signature) =>
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
