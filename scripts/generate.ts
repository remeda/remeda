import * as fs from 'fs';
import marked from 'marked';
import prettier from 'prettier';

import data from '../out.json';
import { flatMap } from '../src/flatMap';

export interface MethodDoc {
  tag: string;
  signature: string;
  example: string;
  args: JsTagProps[];
  returns: JsTagProps;
}

export interface FnDocProps {
  name: string;
  description: string;
  category: string;
  methods: MethodDoc[];
}

export interface JsTagProps {
  name: string;
  description: string;
}

function getReturnType(signature) {
  const type = signature.type.type;
  if (type === 'intrinsic') {
    return signature.type.name;
  }
  if (type === 'array') {
    return 'Array';
  }
  return 'Object';
}

const ret = flatMap(data.children, (method: any) =>
  method.children
    ? method.children
        .filter(
          (item: any) =>
            (item.kindString === 'Function' || item.kindString === 'Module') &&
            item.signatures &&
            item.flags.isExported
        )
        .map(target => {
          if (!target) {
            return;
          }
          console.log('processing', target.name);
          const signatures = target.signatures.filter(s => s.comment);
          if (!signatures.length) {
            return null;
          }
          const comment = signatures[0].comment;
          return {
            name: target.name,
            category: '',
            description: marked(
              (comment.shortText + '\n' + (comment.text || '')).trim(),
              { breaks: true }
            ),
            methods: signatures.map(signature => {
              const tags = signature.comment.tags || target.comment.tags || [];
              const isDataFirst = tags.find(item => item.tag === 'data_first');
              const isDataLast = tags.find(item => item.tag === 'data_last');
              const getTag = name =>
                tags
                  .filter(item => item.tag === name)
                  .map(item => item.text.trim())
                  .join('\n');
              const hasTag = name => !!tags.find(item => item.tag === name);

              function getExample() {
                let str = getTag('example');
                if (str) {
                  return prettier.format(str, {
                    semi: false,
                    singleQuote: true,
                    parser: 'typescript',
                  });
                }
                str = getTag('example-raw');
                return str
                  .split('\n')
                  .map(str => str.replace(/^   /, ''))
                  .join('\n');
              }

              const parameters = signature.parameters || [];
              return {
                tag: isDataFirst
                  ? 'Data First'
                  : isDataLast
                  ? 'Data Last'
                  : null,
                signature: prettier.format(getTag('signature'), {
                  semi: false,
                  singleQuote: true,
                  parser: 'typescript',
                }),
                category: getTag('category'),
                indexed: hasTag('indexed'),
                pipeable: hasTag('pipeable'),
                example: getExample(),
                args: parameters.map((item: any) => ({
                  name: item.name,
                  description: item.comment && item.comment.text,
                })),
                returns: {
                  name: getReturnType(signature),
                  description: getTag('returns'),
                },
              };
            }),
          };
        })
    : []
)
  .filter(item => item)
  .map(item => {
    item.category = item.methods[0].category;
    return item;
  });

fs.writeFileSync('./def.json', JSON.stringify(ret, null, 2));
