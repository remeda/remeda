import { isTruthy } from './isTruthy';

/**
 * @deprecated equivalent to `R.filter(R.isTruthy)` and will be removed in v2.
 *
 * Filter out all falsey values. The values `false`, `null`, `0`, `""`, `undefined`, and `NaN` are falsey.
 * @param items the array to compact
 * @signature
 *    R.compact(array)
 * @example
 *    R.compact([0, 1, false, 2, '', 3]) // => [1, 2, 3]
 * @category Array
 * @pipeable
 */
export function compact<T>(
  items: ReadonlyArray<T | null | undefined | false | '' | 0>
): Array<T> {
  // TODO: Make lazy version
  return items.filter(isTruthy);
}
