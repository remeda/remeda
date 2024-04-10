/* eslint-disable eqeqeq, guard-for-in, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/prefer-destructuring, @typescript-eslint/prefer-readonly-parameter-types, unicorn/no-null, no-eq-null -- FIXME! */

/**
 * Creates a deep copy of the value. Supported types: `Array`, `Object`, `Number`, `String`, `Boolean`, `Date`, `RegExp`. Functions are assigned by reference rather than copied.
 *
 * @param value - The object to clone.
 * @signature R.clone(value)
 * @example R.clone({foo: 'bar'}) // {foo: 'bar'}
 * @category Object
 */
export function clone<T>(value: T): T {
  return value != null && typeof (value as any).clone === "function"
    ? (value as any).clone()
    : cloneImplementation(value, [], []);
}

// from https://github.com/ramda/ramda/blob/master/source/internal/_clone.js
function cloneImplementation(
  value: any,
  refFrom: Array<any>,
  refTo: Array<any>,
): unknown {
  function copy(copiedValue: any): unknown {
    const len = refFrom.length;
    let idx = 0;
    while (idx < len) {
      if (value === refFrom[idx]) {
        return refTo[idx];
      }
      idx += 1;
    }
    refFrom[idx + 1] = value;
    refTo[idx + 1] = copiedValue;
    for (const key in value) {
      copiedValue[key] = cloneImplementation(value[key], refFrom, refTo);
    }
    return copiedValue;
  }
  switch (type(value)) {
    case "Object":
      return copy({});
    case "Array":
      return copy([]);
    case "Date":
      return new Date(value.valueOf());
    case "RegExp":
      return cloneRegExp(value);
    default:
      return value;
  }
}

const type = (val: unknown): string =>
  val === null
    ? "Null"
    : val === undefined
      ? "Undefined"
      : Object.prototype.toString.call(val).slice(8, -1);

const cloneRegExp = (pattern: RegExp): RegExp =>
  new RegExp(
    pattern.source,
    (pattern.global ? "g" : "") +
      (pattern.ignoreCase ? "i" : "") +
      (pattern.multiline ? "m" : "") +
      (pattern.sticky ? "y" : "") +
      (pattern.unicode ? "u" : ""),
  );
