import fs from 'fs';

const data = require('./out.json');

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
  methods: MethodDoc[];
}

export interface JsTagProps {
  name: string;
  description: string;
}
const ret = data.children
  .map((method: any) => {
    const target =
      method.children &&
      method.children.filter(
        item =>
          item.kindString === 'Function' &&
          item.signatures &&
          item.flags.isExported
      )[0];
    if (!target) {
      return;
    }
    console.log('processing', target.name);
    return {
      name: target.name,
      description: target.signatures[0].comment.shortText,
      methods: target.signatures.map(signature => {
        const tags = signature.comment.tags || [];
        const isDataFirst = tags.find(item => item.tag === 'data_first');
        const getTag = name =>
          tags
            .filter(item => item.tag === name)
            .map(item => item.text.trim())
            .join('\n');
        return {
          tag: isDataFirst ? 'Data First' : 'Data Last',
          signature: getTag('signature'),
          example: getTag('example'),
          args: signature.parameters.map(item => ({
            name: item.name,
            description: item.comment && item.comment.text,
          })),
          returns: {
            name: 'todo',
            description: getTag('returns'),
          },
        };
      }),
    };
  })
  .filter(item => item);

fs.writeFileSync('./def.json', JSON.stringify(ret, null, 2));
