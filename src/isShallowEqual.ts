import { purry } from "./purry";

/**
 * Performs a _shallow_ *semantic* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays, an identity check would be performed on every item, in order, and for
 * objects props will be matched and checked for identity.
 *
 * !IMPORTANT: symbol properties of objects are not supported right now and
 * might result in unexpected behavior. Please open an issue in the Remeda
 * github project if you need support for these types.
 *
 * !IMPORTANT: All built-in objects (Promise, Date, RegExp) are shallowly equal,
 * even when they are semantically different (e.g. resolved promises). Use
 * `isDeepEqual` instead.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isEqual` if you don't need a deep comparison and just want to check for
 * simple (`===`, `Object.is`) equality.
 * - `isDeepEqual` for a recursively deep check of arrays and objects.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    R.isShallowEqual(data, other)
 * @example
 *    R.isShallowEqual(1, 1) //=> true
 *    R.isShallowEqual(1, '1') //=> false
 *    R.isShallowEqual([1, 2, 3], [1, 2, 3]) //=> true
 *    R.isShallowEqual([[1], [2], [3]], [[1], [2], [3]]) //=> false
 * @dataFirst
 * @category Guard
 */
export function isShallowEqual<T, S extends T>(
  data: T,
  other: T extends Exclude<T, S> ? S : never,
): data is S;
export function isShallowEqual<T, S extends T = T>(data: T, other: S): boolean;

/**
 * Performs a _shallow_ *semantic* comparison between two values to determine if
 * they are equivalent. For primitive values this is equivalent to `===`, for
 * arrays, an identity check would be performed on every item, in order, and for
 * objects props will be matched and checked for identity.
 *
 * !IMPORTANT: symbol properties of objects are not supported right now and
 * might result in unexpected behavior. Please open an issue in the Remeda
 * github project if you need support for these types.
 *
 * !IMPORTANT: All built-in objects (Promise, Date, RegExp) are shallowly equal,
 * even when they are semantically different (e.g. resolved promises). Use
 * `isDeepEqual` instead.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isEqual` if you don't need a deep comparison and just want to check for
 * simple (`===`, `Object.is`) equality.
 * - `isDeepEqual` for a recursively deep check of arrays and objects.
 *
 * @param other - The second value to compare.
 * @signature
 *    R.isShallowEqual(other)(data)
 * @example
 *    R.pipe(1, R.isShallowEqual(1)) //=> true
 *    R.pipe(1, R.isShallowEqual('1')) //=> false
 *    R.pipe([1, 2, 3], R.isShallowEqual([1, 2, 3])) //=> true
 *    R.pipe([[1], [2], [3]], R.isShallowEqual([[1], [2], [3]])) //=> false
 * @dataFirst
 * @category Guard
 */
export function isShallowEqual<T, S extends T>(
  other: T extends Exclude<T, S> ? S : never,
): (data: T) => data is S;
export function isShallowEqual<S>(
  other: S,
): <T extends S = S>(data: T) => boolean;

export function isShallowEqual(...args: ReadonlyArray<unknown>): unknown {
  return purry(isShallowEqualImplementation, args);
}

function isShallowEqualImplementation<T>(a: T, b: T): boolean {
  if (a === b || Object.is(a, b)) {
    return true;
  }

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }

  if (a instanceof Map && b instanceof Map) {
    return isMapShallowEqual(a, b);
  }

  if (a instanceof Set && b instanceof Set) {
    return isSetShallowEqual(a, b);
  }

  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }

    const { [key as keyof T]: valueA } = a;
    const { [key as keyof T]: valueB } = b;

    if (valueA !== valueB || !Object.is(valueA, valueB)) {
      return false;
    }
  }

  return true;
}

function isMapShallowEqual(
  a: ReadonlyMap<unknown, unknown>,
  b: ReadonlyMap<unknown, unknown>,
): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (const [key, value] of a) {
    const valueB = b.get(key);
    if (value !== valueB || !Object.is(value, valueB)) {
      return false;
    }
  }

  return true;
}

function isSetShallowEqual(
  a: ReadonlySet<unknown>,
  b: ReadonlySet<unknown>,
): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (const value of a) {
    if (!b.has(value)) {
      return false;
    }
  }

  return true;
}
