/* eslint-disable unicorn/no-array-callback-reference */

import type {
  categoriesCollectionName,
  Comment,
  functionsCollectionName,
  Parameter,
  Signature,
} from "@/content/functions/content.config";
import type { InferEntrySchema } from "astro:content";
import { hasAtLeast, isDefined, uniqueBy } from "remeda";
import { ReflectionKind } from "typedoc";
import { hasDefinedProp, type SetDefined } from "./has-defined-prop";

export type DocumentedFunction = ReturnType<typeof transformProject>[number];
export type FunctionSignature = ReturnType<typeof transformSignature>;
export type FunctionParam = ReturnType<typeof getParameter>;
export type FunctionReturn = ReturnType<typeof transformReturns>;

export type SourceTags = Readonly<
  Partial<Record<"pipeable" | "strict" | "indexed" | "lazy", boolean>>
>;

export function transformProject(
  declarations: Array<InferEntrySchema<typeof functionsCollectionName>>,
  categories: Array<InferEntrySchema<typeof categoriesCollectionName>>,
) {
  const functions = declarations.filter(
    ({ kind }) => kind === ReflectionKind.Function,
  );

  const functionNames = new Set(functions.map(({ name }) => name));

  return addCategories(
    categories,
    functions
      .map((func) => transformFunction(func, functionNames))
      .filter(isDefined),
  );
}

function transformFunction(
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

const transformSignature = (signature: SetDefined<Signature, "comment">) =>
  ({
    tag: hasTag(signature.comment.blockTags, "dataFirst")
      ? "Data First"
      : hasTag(signature.comment.blockTags, "dataLast")
        ? "Data Last"
        : undefined,
    signature: tagContent(signature.comment.blockTags, "signature"),
    example: tagContent(signature.comment.blockTags, "example"),
    lazy: hasTag(signature.comment.blockTags, "lazy"),
    args:
      signature.parameters?.map(({ name, comment }) =>
        getParameter(name, comment),
      ) ?? [],
    returns: transformReturns(signature),
  }) as const;

const transformReturns = ({ type, comment }: Signature) =>
  ({
    name:
      type.type === "intrinsic"
        ? type.name
        : type.type === "array"
          ? "Array"
          : type.type === "predicate"
            ? "boolean"
            : "Object",
    description: tagContent(comment.blockTags, "returns"),
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

function addCategories(
  categories: Array<InferEntrySchema<typeof categoriesCollectionName>>,
  functions: ReadonlyArray<NonNullable<ReturnType<typeof transformFunction>>>,
) {
  const categoriesLookup = createCategoriesLookup(categories);
  return functions.map(({ id, ...item }) => ({
    ...item,
    category: categoriesLookup.get(id),
  }));
}

function createCategoriesLookup(
  categories: Array<InferEntrySchema<typeof categoriesCollectionName>>,
): ReadonlyMap<number, string> {
  const result = new Map<number, string>();

  for (const { children, title } of categories) {
    // TODO: We can enforce that only a predefined set of categories is acceptable and break the build on any unknown categories
    for (const id of children) {
      result.set(id, title);
    }
  }

  return result;
}
