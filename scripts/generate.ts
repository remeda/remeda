import * as fs from 'fs';
import marked from 'marked';
import prettier from 'prettier';

import data from '../out.json';

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
  if (signature.type.type === 'intrinsic') {
    return signature.type.name;
  }
  return 'Object';
}

const ret = data.children
  .map((method: any) => {
    const target =
      method.children &&
      method.children.filter(
        (item: any) =>
          item.kindString === 'Function' &&
          item.signatures &&
          item.flags.isExported
      )[0];
    if (!target) {
      return;
    }
    console.log('processing', target.name);
    const signatures = target.signatures.filter(s => s.comment);
    if (!signatures.length) {
      return null;
    }
    return {
      name: target.name,
      category: '',
      description: marked(signatures[0].comment.shortText),
      methods: signatures.map(signature => {
        const tags = signature.comment.tags || [];
        const isDataFirst = tags.find(item => item.tag === 'data_first');
        const isDataLast = tags.find(item => item.tag === 'data_last');
        const getTag = name =>
          tags
            .filter(item => item.tag === name)
            .map(item => item.text.trim())
            .join('\n');
        return {
          tag: isDataFirst ? 'Data First' : isDataLast ? 'Data Last' : null,
          signature: getTag('signature'),
          category: getTag('category'),
          example: prettier.format(getTag('example'), {
            semi: false,
            singleQuote: true,
            parser: 'babylon',
          }),
          args: signature.parameters.map((item: any) => ({
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
  .filter(item => item)
  .map(item => {
    item.category = item.methods[0].category;
    return item;
  });

fs.writeFileSync('./def.json', JSON.stringify(ret, null, 2));
