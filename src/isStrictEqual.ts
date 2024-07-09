import { purry } from "./purry";

/**
 * Determines whether two values are *functionally identical* in all contexts.
 * For primitive values (string, number), this is done by-value, and for objects
 * it is done by-reference (i.e., they point to the same object in memory).
 *
 * Under the hood we use **both** the [`===` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
 * and [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). This means that `isEqual(NaN, NaN) === true` (whereas
 * `NaN !== NaN`), and `isEqual(-0, 0) === true` (whereas
 * `Object.is(-0, 0) === false`).
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * See:
 * - `isDeepEqual` for a semantic comparison that allows comparing arrays and
 * objects "by-value", and recurses for every item.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    R.isEqual(data, other)
 * @example
 *    R.isEqual(1, 1) //=> true
 *    R.isEqual(1, '1') //=> false
 *    R.isEqual([1, 2, 3], [1, 2, 3]) //=> false
 * @dataFirst
 * @category Guard
 */
export function isStrictEqual<T, S extends T>(
  data: T,
  other: T extends Exclude<T, S> ? S : never,
): data is S;
export function isStrictEqual<T, S extends T = T>(data: T, other: S): boolean;

/**
 * Determines whether two values are *functionally identical* in all contexts.
 * For primitive values (string, number), this is done by-value, and for objects
 * it is done by-reference (i.e., they point to the same object in memory).
 *
 * Under the hood we use **both** the [`===` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
 * and [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). This means that `isEqual(NaN, NaN) === true` (whereas
 * `NaN !== NaN`), and `isEqual(-0, 0) === true` (whereas
 * `Object.is(-0, 0) === false`).
 *
 * See:
 * - `isDeepEqual` for a semantic comparison that allows comparing arrays and
 * objects "by-value", and recurses for every item.
 * - `isShallowEqual` if you need to compare arrays and objects "by-value" but
 * don't want to recurse into their values.
 *
 * @param other - The second value to compare.
 * @signature
 *    R.isEqual(other)(data)
 * @example
 *    R.pipe(1, R.isEqual(1)); //=> true
 *    R.pipe(1, R.isEqual('1')); //=> false
 *    R.pipe([1, 2, 3], R.isEqual([1, 2, 3])); //=> false
 * @dataLast
 * @category Guard
 */
export function isStrictEqual<T, S extends T>(
  other: T extends Exclude<T, S> ? S : never,
): (data: T) => data is S;
export function isStrictEqual<S>(
  other: S,
): <T extends S = S>(data: T) => boolean;

export function isStrictEqual(...args: ReadonlyArray<unknown>): unknown {
  return purry(isStrictlyEqualImplementation, args);
}

const isStrictlyEqualImplementation = <T, S>(
  data: S | T,
  other: S,
): data is S => data === other || Object.is(data, other);
