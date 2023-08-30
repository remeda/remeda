import fs from 'fs';
import { parse as markedParse, type MarkedOptions } from 'marked';
// import {
//   format as prettierFormat,
//   type Options as PrettierOptions,
// } from 'prettier';
import type { SetRequired } from 'type-fest';
import { ReflectionKind, type JSONOutput } from 'typedoc';

const MARKED_OPTIONS = {
  breaks: true,
} satisfies MarkedOptions;

// const PRETTIER_OPTIONS = {
//   parser: 'typescript',
//   semi: false,
//   singleQuote: true,
// } satisfies PrettierOptions;

main(process.argv.slice(1));

function main([, dataFileName, outputFileName]: ReadonlyArray<string>): void {
  if (dataFileName === undefined || outputFileName === undefined) {
    console.log('Usage: script <inputFile> <outputFile>');
    process.exit(1);
  }

  if (!fs.existsSync(dataFileName)) {
    console.error(`Input file '${dataFileName}' does not exist.`);
    process.exit(1);
  }

  if (fs.existsSync(outputFileName)) {
    console.warn(
      `Warning: Output file '${outputFileName}' already exists and will be overwritten.`
    );
  }

  const jsonData = fs.readFileSync(dataFileName, 'utf8');
  const data = JSON.parse(jsonData);

  const output = transformProject(data);

  const jsonOutput = JSON.stringify(output, null, 2);
  fs.writeFileSync(outputFileName, jsonOutput);
}

function transformProject({ children }: JSONOutput.ProjectReflection) {
  if (children === undefined) {
    return [];
  }

  return children
    .filter(({ kind }) => kind === ReflectionKind.Function)
    .flatMap(transformFunction)
    .filter(isDefined)
    .map(item => ({
      ...item,
      category: item.methods[0].category,
    }));
}

function transformFunction({
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

  const [{ comment: firstComment }] = signaturesWithComments;
  const commentText = firstComment.summary.map(({ text }) => text).join();
  const description = markedParse(commentText, MARKED_OPTIONS);

  const methods = signaturesWithComments.map(transformSignature);

  return { name, description, methods };
}

function transformSignature({
  comment,
  parameters = [],
  type,
}: SetRequired<JSONOutput.SignatureReflection, 'comment'>) {
  const isDataFirst = hasModifierTag(comment, 'data_first');
  const isDataLast = hasModifierTag(comment, 'data_last');

  const tag = isDataFirst ? 'Data First' : isDataLast ? 'Data Last' : null;

  const signature = tagContent(comment, 'signature') ?? '';

  const args = parameters.map(({ name, comment }) => ({
    name,
    description: comment?.summary.map(({ text }) => text).join(''),
  }));

  return {
    tag,
    signature,
    category: tagName(comment, 'category'),
    indexed: hasModifierTag(comment, 'indexed'),
    pipeable: hasModifierTag(comment, 'pipeable'),
    strict: hasModifierTag(comment, 'strict'),
    example: getExample(comment),
    args,
    returns: {
      name: getReturnType(type),
      description: tagName(comment, 'returns') ?? '',
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

function getReturnType(type: JSONOutput.SomeType | undefined) {
  type === undefined
    ? 'Object'
    : type.type === 'intrinsic'
    ? type.name
    : type.type === 'array'
    ? 'Array'
    : 'Object';
}

function getExample(comment: JSONOutput.Comment) {
  const example = tagContent(comment, 'example');
  if (example !== undefined) {
    return example;
  }

  const exampleRaw = tagContent(comment, 'example-raw');
  return exampleRaw
    ?.split('\n')
    .map(str => str.replace(/^ {3}/, ''))
    .join('\n');
}

function hasModifierTag(
  { modifierTags }: JSONOutput.Comment,
  tagName: string
): boolean {
  return modifierTags === undefined
    ? false
    : modifierTags.includes(`@${tagName}`);
}

function tagName(
  { blockTags }: JSONOutput.Comment,
  tagName: string
): string | undefined {
  return blockTags === undefined
    ? undefined
    : blockTags.find(({ tag }) => tag === `@${tagName}`)?.name;
}

function tagContent(
  { blockTags }: JSONOutput.Comment,
  tagName: string
): string | undefined {
  return blockTags === undefined
    ? undefined
    : blockTags
        .find(({ tag }) => tag === `@${tagName}`)
        ?.content.map(({ text }) => text)
        .join();
}
