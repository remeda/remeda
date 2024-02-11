/* eslint-disable unicorn/no-array-callback-reference */

import { hasAtLeast, isDefined } from "remeda";
import invariant from "tiny-invariant";
import type { SetRequired } from "type-fest";
import { ReflectionKind, type JSONOutput } from "typedoc";
import DATA from "@/data/data.json";

export type DocumentedFunction = ReturnType<typeof transformProject>[number];

export function transformProject(project: typeof DATA) {
  const { children } = project;
  invariant(children !== undefined, "The typedoc output is empty!");

  const functions = children
    .filter(({ kind }) => kind === ReflectionKind.Function)
    .map(transformFunction);

  return addCategories(project, functions.filter(isDefined.strict));
}

function transformFunction({
  id,
  name,
  sources,
  signatures,
}: JSONOutput.DeclarationReflection) {
  if (signatures === undefined) {
    return;
  }

  const signaturesWithComments = signatures.filter(hasComment);
  if (!hasAtLeast(signaturesWithComments, 1)) {
    return;
  }

  const [
    {
      comment: { summary },
    },
  ] = signaturesWithComments;
  const description =
    summary.length === 0 ? undefined : summary.map(({ text }) => text).join("");

  const methods = signaturesWithComments.map(transformSignature);

  const source = sources?.[0]?.url;

  return { id, name, description, methods, source };
}

function transformSignature({
  comment,
  parameters = [],
  type,
}: SetRequired<JSONOutput.SignatureReflection, "comment">) {
  return {
    tag: getFunctionCurriedVariant(comment),
    signature: tagContent(comment, "signature"),
    indexed: hasTag(comment, "indexed"),
    pipeable: hasTag(comment, "pipeable"),
    strict: hasTag(comment, "strict"),
    example: getExample(comment),
    args: parameters.map(getParameter),
    returns: {
      name: getReturnType(type),
      description: tagContent(comment, "returns"),
    },
  };
}

function getFunctionCurriedVariant(comment: JSONOutput.Comment) {
  if (hasTag(comment, "dataFirst")) {
    return "Data First";
  }

  if (hasTag(comment, "dataLast")) {
    return "Data Last";
  }

  return;
}

function hasComment(
  item: JSONOutput.SignatureReflection,
): item is SetRequired<JSONOutput.SignatureReflection, "comment"> {
  return item.comment !== undefined;
}

function getReturnType(type: JSONOutput.SomeType | undefined) {
  return type === undefined
    ? "Object"
    : type.type === "intrinsic"
      ? type.name
      : type.type === "array"
        ? "Array"
        : type.type === "predicate"
          ? "boolean"
          : "Object";
}

function getExample(comment: JSONOutput.Comment): string | undefined {
  return (
    tagContent(comment, "example") ??
    tagContent(comment, "exampleRaw")
      ?.split("\n")
      .map((str) => str.replace(/^ {3}/, ""))
      .join("\n")
  );
}

function getParameter({ name, comment }: JSONOutput.ParameterReflection) {
  const summarySegments = comment?.summary ?? [];
  return {
    name,
    description:
      summarySegments.length === 0
        ? undefined
        : summarySegments.map(({ text }) => text).join(""),
  };
}

function hasTag({ blockTags }: JSONOutput.Comment, tagName: string): boolean {
  return blockTags === undefined
    ? false
    : blockTags.some(({ tag }) => tag === `@${tagName}`);
}

function tagContent(
  { blockTags }: JSONOutput.Comment,
  tagName: string,
): string | undefined {
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
  { categories }: JSONOutput.ProjectReflection,
  functions: ReadonlyArray<NonNullable<ReturnType<typeof transformFunction>>>,
) {
  invariant(
    categories !== undefined,
    "Category data is missing from typedoc output!",
  );
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

    // TODO: We can enforce that only a predefined set of categories is
    // acceptable and break the build on any unknown categories
    for (const id of children) {
      result.set(id, title);
    }
  }

  return result;
}
