import type {
  Comment,
  functionsCollectionName,
  Parameter,
  Signature,
} from "@/content/functions/content.config";
import type { InferEntrySchema } from "astro:content";
import { prop } from "remeda";
import { ALL_NAMES } from "./all-names";
import { getTags } from "./get-tags";

export const extractName = ({
  name,
}: InferEntrySchema<typeof functionsCollectionName>) => name;

export const extractSourceUrl = ({
  sources: [source],
}: InferEntrySchema<typeof functionsCollectionName>) => source?.url;

export const extractDescription = ({
  signatures: [
    {
      comment: { summary },
    },
  ],
}: InferEntrySchema<typeof functionsCollectionName>) =>
  summary.length === 0
    ? undefined
    : summary
        .map(({ kind, text }) => {
          if (kind !== "code") {
            return text;
          }

          const codeContent = text.slice(1, -1);
          if (!ALL_NAMES.has(codeContent)) {
            return text;
          }

          // If this is a function name, link to its anchor:
          return `[${text}](#${codeContent})`;
        })
        .join("");

export const extractVariant = ({ comment: { blockTags } }: Signature) =>
  hasTag(blockTags, "dataFirst")
    ? "Data First"
    : hasTag(blockTags, "dataLast")
      ? "Data Last"
      : undefined;

export const extractSignature = ({ comment: { blockTags } }: Signature) =>
  tagContent(blockTags, "signature");

export const extractExample = ({ comment: { blockTags } }: Signature) =>
  tagContent(blockTags, "example");

export const extractTags = ({
  signatures: [
    {
      comment: { blockTags },
    },
  ],
}: InferEntrySchema<typeof functionsCollectionName>) =>
  getTags([{ lazy: hasTag(blockTags, "lazy") }]);

export const extractArgs = ({ parameters }: Signature) =>
  parameters?.map(getParameter);

export const extractReturns = ({
  type,
  comment: { blockTags },
}: Signature) => ({
  name:
    type.type === "intrinsic"
      ? type.name
      : type.type === "array"
        ? "Array"
        : type.type === "predicate"
          ? "boolean"
          : "Object",
  description: tagContent(blockTags, "returns"),
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
