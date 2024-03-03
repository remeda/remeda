import { isTruthy } from "./isTruthy";

/**
 * Filter out all falsey values. The values `false`, `null`, `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * **DEPRECATED: equivalent to `R.filter(R.isTruthy)` and so will be removed in v2.**
 *
 * @param items the array to compact
 * @signature
 *    R.compact(array)
 * @example
 *    R.compact([0, 1, false, 2, '', 3]) // => [1, 2, 3]
 * @category Array
 * @deprecated equivalent to `R.filter(R.isTruthy)` and so will be removed in v2.
 */
export function compact<T>(
  items: ReadonlyArray<T | "" | 0 | false | null | undefined>,
): Array<T> {
  // TODO: Make lazy version
  return items.filter(isTruthy);
}
