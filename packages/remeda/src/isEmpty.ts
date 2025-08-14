import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * A function that checks if the passed parameter is empty.
 *
 * This function has *limited* utility at the type level because negating it
 * does not yield a useful type in most cases because of TypeScript
 * limitations. Additionally, utilities which accept a narrower input type
 * provide better type-safety on their inputs. In most cases, you should use
 * one of the following functions instead:
 * * `isEmptyish` - supports a wider range of cases, accepts any input including nullish values, and does a better job at narrowing the result.
 * * `hasAtLeast` - when the input is just an array/tuple.
 * * `isStrictEqual` - when you just need to check for a specific literal value.
 * * `isNullish` - when you just care about `null` and `undefined`.
 * * `isTruthy` - when you need to also filter `number` and `boolean`.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is empty, false otherwise.
 * @signature
 *    R.isEmpty(data)
 * @example
 *    R.isEmpty('') //=> true
 *    R.isEmpty([]) //=> true
 *    R.isEmpty({}) //=> true
 *
 *    R.isEmpty(undefined) //=> false
 *    R.isEmpty('test') //=> false
 *    R.isEmpty([1, 2, 3]) //=> false
 *    R.isEmpty({ a: "hello" }) //=> false
 * @category Guard
 */
export function isEmpty(data: IterableContainer): data is [];
export function isEmpty<T extends object>(
  data: T,
): data is Record<keyof T, never>;
export function isEmpty<T extends string>(
  data: T,
): data is "" extends T ? "" : never;

// eslint-disable-next-line jsdoc/require-example, jsdoc/require-param, jsdoc/require-description
/**
 * @deprecated Use `isEmptyish` instead!
 */
export function isEmpty<T extends string | undefined>(
  data: T,
): data is
  | ("" extends T ? "" : never)
  | (undefined extends T ? undefined : never);

export function isEmpty(data: object | string | undefined): boolean {
  if (
    data === "" ||
    // TODO [>2]: remove `undefined` support!
    data === undefined
  ) {
    return true;
  }

  if (Array.isArray(data)) {
    return data.length === 0;
  }

  return Object.keys(data).length === 0;
}
