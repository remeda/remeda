import { isTruthy } from './guards';

/**
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
  items: readonly (T | null | undefined | false | '' | 0)[]
): T[] {
  // TODO: Make lazy version
  return items.filter(isTruthy);
}
