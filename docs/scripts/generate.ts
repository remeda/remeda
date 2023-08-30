import fs from 'fs';
import { parse as markedParse, type MarkedOptions } from 'marked';
import {
  format as prettierFormat,
  type Options as PrettierOptions,
} from 'prettier';
import {
  Comment,
  ReflectionKind,
  type DeclarationReflection,
  type ProjectReflection,
  type SignatureReflection,
} from 'typedoc';

const MARKED_OPTIONS: MarkedOptions = {
  breaks: true,
} as const;

const PRETTIER_OPTIONS: PrettierOptions = {
  semi: false,
  singleQuote: true,
  parser: 'typescript',
} as const;

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

function transformProject({ children }: ProjectReflection) {
  if (children === undefined) {
    return [];
  }

  return children
    .flatMap(transformModules)
    .filter(isDefined)
    .map(item => ({
      ...item,
      category: item.methods[0].category,
    }));
}

function transformModules({ children }: DeclarationReflection) {
  if (children === undefined) {
    return [];
  }

  return children
    .filter(
      ({ kind, signatures }) =>
        (kind === ReflectionKind.Function || kind === ReflectionKind.Module) &&
        signatures !== undefined
    )
    .map(transformMethod);
}

function transformMethod(target: DeclarationReflection) {
  console.log('processing', target.name);
  const signatures = target.signatures!.filter(
    ({ comment }) => comment !== undefined
  );
  const [first] = signatures;
  if (first === undefined) {
    return;
  }
  const { comment } = first;
  if (comment === undefined) {
    return;
  }
  return {
    name: target.name,
    category: '',
    description: markedParse(
      Comment.displayPartsToMarkdown(comment.summary, () => ''),
      MARKED_OPTIONS
    ),
    methods: signatures.map(signature => {
      const relevantComment = signature.comment ?? comment;

      const isDataFirst = relevantComment.getTag('@data_first');
      const isDataLast = relevantComment.getTag('@data_last');

      function getExample() {
        let tag = relevantComment.getTag('@example');
        if (tag !== undefined) {
          return prettierFormat(
            tag.content.map(({ text }) => text).join('\n'),
            PRETTIER_OPTIONS
          );
        }
        tag = relevantComment.getTag('@example-raw');
        return tag?.content
          .map(({ text }) => text)
          .map(str => str.replace(/^ {3}/, ''))
          .join('\n');
      }

      const parameters = signature.parameters || [];
      return {
        tag:
          isDataFirst !== undefined
            ? 'Data First'
            : isDataLast !== undefined
            ? 'Data Last'
            : null,
        signature: prettierFormat(
          relevantComment
            .getTag('@signature')
            ?.content.map(({ text }) => text)
            .join('\n') ?? '',
          PRETTIER_OPTIONS
        ),
        category: relevantComment
          .getTag('@category')
          ?.content.map(({ text }) => text)
          .join('\n'),
        indexed: relevantComment.getTag('@indexed') !== undefined,
        pipeable: relevantComment.getTag('@pipeable') !== undefined,
        strict: relevantComment.getTag('@strict') !== undefined,
        example: getExample(),
        args: parameters.map((item: any) => ({
          name: item.name,
          description: item.comment && item.comment.text,
        })),
        returns: {
          name: getReturnType(signature),
          description:
            relevantComment
              .getTag('@returns')
              ?.content.map(({ text }) => text)
              .join('\n') ?? '',
        },
      };
    }),
  };
}

function getReturnType(signature: SignatureReflection) {
  const type = signature.type?.type;
  if (type === 'intrinsic') {
    return signature.type.name;
  }
  if (type === 'array') {
    return 'Array';
  }
  return 'Object';
}

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

main(process.argv.slice(1));
