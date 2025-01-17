import type {
  Comment,
  functionsCollectionName,
  Parameter,
  Signature,
} from "@/content/functions/content.config";
import type { InferEntrySchema } from "astro:content";
import { map, pipe, prop, uniqueBy } from "remeda";

export type DocumentedFunction = ReturnType<typeof transformFunction>;
export type FunctionSignature = DocumentedFunction["methods"][number];

export const transformFunction = (
  {
    sources: [source],
    signatures,
    ...rest
  }: InferEntrySchema<typeof functionsCollectionName>,
  functionNames: ReadonlySet<string>,
) => ({
  description: getDescription(signatures[0], functionNames),
  methods: pipe(
    signatures,
    map(transformSignature),
    uniqueBy(prop("signature")),
  ),
  sourceUrl: source?.url,
  ...rest,
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

const transformSignature = ({
  comment: { blockTags },
  parameters,
  type,
}: Signature) => ({
  tag: hasTag(blockTags, "dataFirst")
    ? "Data First"
    : hasTag(blockTags, "dataLast")
      ? "Data Last"
      : undefined,
  signature: tagContent(blockTags, "signature"),
  example: tagContent(blockTags, "example"),
  lazy: hasTag(blockTags, "lazy"),
  args: parameters?.map(getParameter) ?? [],
  returns: {
    name:
      type.type === "intrinsic"
        ? type.name
        : type.type === "array"
          ? "Array"
          : type.type === "predicate"
            ? "boolean"
            : "Object",
    description: tagContent(blockTags, "returns"),
  },
});

function getParameter({ name, comment }: Parameter) {
  const summarySegments = comment?.summary ?? [];
  const description =
    summarySegments.length === 0
      ? undefined
      : summarySegments.map(prop("text")).join("");
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

  return content.map(prop("text")).join("");
}
