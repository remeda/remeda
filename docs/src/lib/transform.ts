/* eslint-disable unicorn/no-array-callback-reference */

import type {
  categoriesCollectionName,
  functionsCollectionName,
} from "@/content/functions/content.config";
import type { InferEntrySchema } from "astro:content";
import { hasAtLeast, isDefined, uniqueBy } from "remeda";
import { ReflectionKind, type JSONOutput } from "typedoc";
import { hasDefinedProp, type SetDefined } from "./has-defined-prop";

export type DocumentedFunction = ReturnType<typeof transformProject>[number];
export type FunctionSignature = ReturnType<typeof transformSignature>;
export type FunctionParam = ReturnType<typeof getParameter>;
export type FunctionReturn = ReturnType<typeof transformReturns>;

type Sig = NonNullable<
  InferEntrySchema<typeof functionsCollectionName>["signatures"]
>[number];

type Signature = SetDefined<NonNullable<Sig>, "comment">;

type BlockTags = NonNullable<Sig["comment"]>["blockTags"];

type Param = NonNullable<NonNullable<Sig>["parameters"]>[number]["comment"];

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
    sources,
    signatures,
  }: InferEntrySchema<typeof functionsCollectionName>,
  functionNames: ReadonlySet<string>,
) {
  if (signatures === undefined) {
    return;
  }

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

  const sourceUrl = sources?.[0]?.url;

  return { id, name, description, methods, sourceUrl };
}

const transformSignature = (signature: Signature) =>
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
      type === undefined
        ? "Object"
        : type.type === "intrinsic"
          ? type.name
          : type.type === "array"
            ? "Array"
            : type.type === "predicate"
              ? "boolean"
              : "Object",
    description: tagContent(comment.blockTags, "returns"),
  }) as const;

function getParameter(name: string, comment: Param) {
  const summarySegments = comment?.summary ?? [];
  const description =
    summarySegments.length === 0
      ? undefined
      : summarySegments.map(({ text }) => text).join("");
  return { name, description } as const;
}

function hasTag(blockTags: BlockTags, tagName: string): boolean {
  return blockTags === undefined
    ? false
    : blockTags.some(({ tag }) => tag === `@${tagName}`);
}

function tagContent(blockTags: BlockTags, tagName: string): string | undefined {
  if (blockTags === undefined) {
    return;
  }

  const tag = blockTags.find(({ tag }) => tag === `@${tagName}`);

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
  categories: ReadonlyArray<JSONOutput.ReflectionCategory>,
  functions: ReadonlyArray<NonNullable<ReturnType<typeof transformFunction>>>,
) {
  const categoriesLookup = createCategoriesLookup(categories);
  return functions.map(({ id, ...item }) => ({
    ...item,
    category: categoriesLookup.get(id),
  }));
}

function createCategoriesLookup(
  categories: ReadonlyArray<JSONOutput.ReflectionCategory>,
): ReadonlyMap<number, string> {
  const result = new Map<number, string>();

  for (const { children, title } of categories) {
    if (children === undefined) {
      continue;
    }

    // TODO: We can enforce that only a predefined set of categories is acceptable and break the build on any unknown categories
    for (const id of children) {
      result.set(id, title);
    }
  }

  return result;
}
