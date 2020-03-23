// from https://github.com/ramda/ramda/blob/master/source/type.js
/**
 * Gives a single-word string description of the (native) type of a value, returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not attempt to distinguish user Object types any further, reporting them all as 'Object'.
 * @param val
 * @signature
 *    R.type(obj)
 * @example
 *    R.type({}); //=> "Object"
 *    R.type(1); //=> "Number"
 *    R.type(false); //=> "Boolean"
 *    R.type('s'); //=> "String"
 *    R.type(null); //=> "Null"
 *    R.type([]); //=> "Array"
 *    R.type(/[A-z]/); //=> "RegExp"
 *    R.type(() => {}); //=> "Function"
 *    R.type(undefined); //=> "Undefined"
 * @category Type
 */
export function type(val: any) {
  return val === null
    ? 'Null'
    : val === undefined
    ? 'Undefined'
    : Object.prototype.toString.call(val).slice(8, -1);
}
