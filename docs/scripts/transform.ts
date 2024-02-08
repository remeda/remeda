/* eslint-disable unicorn/no-array-callback-reference, unicorn/no-process-exit */

/**
 * This script takes the JSON output of typedoc and reformats and transforms it
 * to what our site needs in order to render the functions page.
 */

import fs from "node:fs/promises";
import invariant from "tiny-invariant";
import type { PartialOnUndefinedDeep, SetRequired } from "type-fest";
import { ReflectionKind, type JSONOutput } from "typedoc";

/**
 * Allows the site to "parse" the output of this script and use it's types as is
 * without needing to use `any`, `unknown` or sync types manually. It is built
 * dynamically from the return type of the main function so that the actual
 * logic is the source of truth for the types so we don't get any type drifts.
 *
 * !IMPORTANT - Don't change this type if you have a typing issue! You most likely need to change one of the functions in this file to return something different.
 *
 * @example
 *   import { type FunctionsData } from '../scripts/transform';
 *   import data from '../build/data.json';
 *   const FUNCTIONS_DATA = data as unknown as FunctionsData;
 */
export type FunctionsData = ReadonlyArray<
  // We use PartialOnUndefinedDeep because the output goes through
  // `JSON.stringify` which strips any object properties which have a value of
  // `undefined`.
  PartialOnUndefinedDeep<
    // We had to "break" the array and rebuild it because type-fest's
    // `PartialOnUndefinedDeep` works on objects at the top level and not arrays
    // even while using the `recurseIntoArrays` option).
    ReturnType<typeof transformProject>[number],
    { recurseIntoArrays: true }
  >
>;

try {
  await main(process.argv.slice(1));
  console.log("✅ Done!");
} catch (error) {
  console.log("💩 The process threw an error!", error);
  process.exit(1);
}

async function main([
  ,
  dataFileName,
  outputFileName,
]: ReadonlyArray<string>): Promise<void> {
  if (dataFileName === undefined || outputFileName === undefined) {
    console.log("Usage: script <inputFile> <outputFile>");
    process.exit(1);
  }

  const jsonData = await fs.readFile(dataFileName, "utf8");
  const data = JSON.parse(jsonData) as unknown as JSONOutput.ProjectReflection;

  const output = transformProject(data);

  /* eslint-disable-next-line unicorn/no-null */
  const jsonOutput = JSON.stringify(output, null, 2);
  await fs.writeFile(outputFileName, jsonOutput);
}

function transformProject(project: JSONOutput.ProjectReflection) {
  const { children } = project;
  invariant(children !== undefined, "The typedoc output is empty!");

  const functions = children
    .filter(({ kind }) => kind === ReflectionKind.Function)
    .map(transformFunction);

  return addCategories(project, functions.filter(isDefined));
}

function transformFunction({
  id,
  name,
  signatures,
}: JSONOutput.DeclarationReflection) {
  console.log("processing", name);

  if (signatures === undefined) {
    return;
  }

  const signaturesWithComments = signatures.filter(hasComment);
  if (!isNonEmpty(signaturesWithComments)) {
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

  return { id, name, description, methods };
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

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function isNonEmpty<T>(value: ReadonlyArray<T>): value is [T, ...Array<T>] {
  return value.length > 0;
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
  functions: ReadonlyArray<
    NonNullable<Awaited<ReturnType<typeof transformFunction>>>
  >,
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
