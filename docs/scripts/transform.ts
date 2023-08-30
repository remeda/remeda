import fs from 'node:fs/promises';
import { parse as markedParse, type MarkedOptions } from 'marked';
import {
  format as prettierFormat,
  type Options as PrettierOptions,
} from 'prettier';
import invariant from 'tiny-invariant';
import type { SetRequired } from 'type-fest';
import { ReflectionKind, type JSONOutput } from 'typedoc';

const MARKED_OPTIONS = {
  breaks: true,
} satisfies MarkedOptions;

const PRETTIER_OPTIONS = {
  parser: 'typescript',
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
} satisfies PrettierOptions;

main(process.argv.slice(1))
  .then(() => {
    console.log('Done!');
  })
  .catch(e => {
    console.log('Encountered Error', e);
  });

async function main([
  ,
  dataFileName,
  outputFileName,
]: ReadonlyArray<string>): Promise<void> {
  if (dataFileName === undefined || outputFileName === undefined) {
    console.log('Usage: script <inputFile> <outputFile>');
    process.exit(1);
  }

  const jsonData = await fs.readFile(dataFileName, 'utf8');
  const data = JSON.parse(jsonData);

  const output = await transformProject(data);

  const jsonOutput = JSON.stringify(output, null, 2);
  await fs.writeFile(outputFileName, jsonOutput);
}

async function transformProject({
  children,
  categories,
}: JSONOutput.ProjectReflection) {
  invariant(children !== undefined, 'The typedoc output is empty!');
  invariant(
    categories !== undefined,
    'Category data is missing from typedoc output!'
  );

  const categoriesLookup = createCategoriesLookup(categories);

  const functions = await Promise.all(
    children
      .filter(({ kind }) => kind === ReflectionKind.Function)
      .map(transformFunction)
  );

  return functions.filter(isDefined).map(({ id, ...item }) => ({
    ...item,
    category: categoriesLookup.get(id),
  }));
}

async function transformFunction({
  id,
  name,
  signatures,
}: JSONOutput.DeclarationReflection) {
  console.log('processing', name);

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
    summary.length === 0
      ? undefined
      : markedParse(summary.map(({ text }) => text).join(''), MARKED_OPTIONS);

  const methods = await Promise.all(
    signaturesWithComments.map(transformSignature)
  );

  return { id, name, description, methods };
}

async function transformSignature({
  comment,
  parameters = [],
  type,
}: SetRequired<JSONOutput.SignatureReflection, 'comment'>) {
  return {
    tag: hasTag(comment, 'dataFirst')
      ? 'Data First'
      : hasTag(comment, 'dataLast')
      ? 'Data Last'
      : null,
    signature: await getFunctionSignature(comment),
    category: tagName(comment, 'category'),
    indexed: hasTag(comment, 'indexed'),
    pipeable: hasTag(comment, 'pipeable'),
    strict: hasTag(comment, 'strict'),
    example: await getExample(comment),
    args: parameters.map(getParameter),
    returns: {
      name: getReturnType(type),
      description: tagName(comment, 'returns'),
    },
  };
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function isNonEmpty<T>(value: ReadonlyArray<T>): value is [T, ...Array<T>] {
  return value.length > 0;
}

function hasComment(
  item: JSONOutput.SignatureReflection
): item is SetRequired<JSONOutput.SignatureReflection, 'comment'> {
  return item.comment !== undefined;
}

function getReturnType(type: JSONOutput.SomeType) {
  return type.type === 'intrinsic'
    ? type.name
    : type.type === 'array'
    ? 'Array'
    : type.type === 'predicate'
    ? 'boolean'
    : 'Object';
}

async function getExample(comment: JSONOutput.Comment): Promise<string> {
  const example = tagContent(comment, 'example');
  if (example !== undefined) {
    return prettierFormat(example, PRETTIER_OPTIONS);
  }

  const exampleRaw = tagContent(comment, 'exampleRaw');
  return exampleRaw
    ?.split('\n')
    .map(str => str.replace(/^ {3}/, ''))
    .join('\n');
}

function getParameter({ name, comment }: JSONOutput.ParameterReflection) {
  const summarySegments = comment?.summary ?? [];
  return {
    name,
    description:
      summarySegments.length === 0
        ? undefined
        : summarySegments.map(({ text }) => text).join(''),
  };
}

async function getFunctionSignature(comment: JSONOutput.Comment) {
  const signatureRaw = tagContent(comment, 'signature');

  if (signatureRaw === undefined) {
    return;
  }

  return prettierFormat(signatureRaw, PRETTIER_OPTIONS);
}

function hasTag({ blockTags }: JSONOutput.Comment, tagName: string): boolean {
  return blockTags === undefined
    ? false
    : blockTags.some(({ tag }) => tag === `@${tagName}`);
}

function tagName(
  { blockTags }: JSONOutput.Comment,
  tagName: string
): string | undefined {
  return blockTags.find(({ tag }) => tag === `@${tagName}`)?.name;
}

function tagContent(
  { blockTags }: JSONOutput.Comment,
  tagName: string
): string | undefined {
  const tag = blockTags.find(({ tag }) => tag === `@${tagName}`);

  if (tag === undefined) {
    return;
  }

  const { content } = tag;
  if (content.length === 0) {
    return undefined;
  }

  return content.map(({ text }) => text).join('');
}

function createCategoriesLookup(
  categories: ReadonlyArray<JSONOutput.ReflectionCategory>
): Map<number, string> {
  const result = new Map<number, string>();

  for (const { children, title } of categories) {
    // TODO: We can enforce that only a predefined set of categories is
    // acceptable and break the build on any unknown categories
    for (const id of children) {
      result.set(id, title);
    }
  }

  return result;
}
