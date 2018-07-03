// from https://github.com/ramda/ramda/blob/master/source/type.js

export function type(val: any) {
  return val === null
    ? 'Null'
    : val === undefined
      ? 'Undefined'
      : Object.prototype.toString.call(val).slice(8, -1);
}
