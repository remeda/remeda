// from https://github.com/ramda/ramda/blob/master/source/type.js

/**
 * Gives a single-word string description of the (native) type of a value, returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not attempt to distinguish user Object types any further, reporting them all as 'Object'.
 *
 * ! **DEPRECATED**: Use `typeof val`, or one of the guards offered by this library. Will be removed in V2! We don't know what the use case for this function is. If you have a use case reach out via a GitHub issue so we can discuss this.
 *
 * @param val - Value to return type of.
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
 * @category Deprecated
 * @deprecated Use `typeof val`, or one of the guards offered by this library. Will be removed in V2! We don't know what the use case for this function is. If you have a use case reach out via a GitHub issue so we can discuss this.
 */
export function type(val: unknown): string {
  return val === null
    ? "Null"
    : val === undefined
      ? "Undefined"
      : Object.prototype.toString.call(val).slice(8, -1);
}
