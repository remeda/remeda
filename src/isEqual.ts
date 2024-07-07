import { purry } from "./purry";

/**
 * Performs a _native_ equality check between two values to. For primitive
 * values this is done by value, and for `object`s it is done by reference. This
 * uses the [`===`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
 * operator and [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
 * under the hood.
 *
 * Important: Because we both equality operators are used in tandem,
 * `isEqual(NaN, NaN) === true` (whereas `NaN !== NaN`), and
 * `isEqual(-0, 0) === true` (whereas `Object.is(-0, 0) === false`).
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
export function isEqual<T, S extends T>(
  data: T,
  other: T extends Exclude<T, S> ? S : never,
): data is S;
export function isEqual<T, S extends T = T>(data: T, other: S): boolean;

/**
 * Performs a _native_ equality check between two values to. For primitive
 * values this is done by value, and for `object`s it is done by reference. This
 * uses the [`===`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
 * operator and [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
 * under the hood.
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
export function isEqual<T, S extends T>(
  other: T extends Exclude<T, S> ? S : never,
): (data: T) => data is S;
export function isEqual<S>(other: S): <T extends S = S>(data: T) => boolean;

export function isEqual(...args: ReadonlyArray<unknown>): unknown {
  return purry(isEqualImplementation, args);
}

const isEqualImplementation = <T, S>(data: S | T, other: S): data is S =>
  data === other || Object.is(data, other);
