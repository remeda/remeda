import { purry } from './purry';

export const _groupWith = <T>(
  list: readonly T[],
  fn: (a: T, b: T) => boolean
) => {
  const res = [];
  let idx = 0;
  const len = list.length;
  while (idx < len) {
    let nextidx = idx + 1;
    while (nextidx < len && fn(list[nextidx - 1], list[nextidx])) {
      nextidx += 1;
    }
    res.push(list.slice(idx, nextidx));
    idx = nextidx;
  }
  return res;
};

/**
 * Takes a list and returns a list of lists where each sublist's elements are
 * all satisfied pairwise comparison according to the provided function.
 * Only adjacent elements are passed to the comparison function.
 *
 * @category Array
 * @data_first
 * @signature
 *   R.groupWith(array, fn)
 * @param {Array} list The array to group.
 * @param {Function} fn Function for determining whether two given (adjacent)
 *        elements should be in the same group
 * @return {Array} A list that contains sublists of elements,
 *         whose concatenations are equal to the original list.
 * @example
 *
 * R.groupWith([0, 1, 1, 2, 3, 5, 8, 13, 21], (a, b) => a === b)
 * //=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]
 *
 * R.groupWith([0, 1, 1, 2, 3, 5, 8, 13, 21], (a, b) => a + 1 === b)
 * //=> [[0, 1], [1, 2, 3], [5], [8], [13], [21]]
 *
 * R.groupWith([0, 1, 1, 2, 3, 5, 8, 13, 21], (a, b) => a % 2 === b % 2)
 * //=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]
 *
 */
export function groupWith<T>(
  list: readonly T[],
  fn: (a: T, b: T) => boolean
): T[];

/**
 * Takes a list and returns a list of lists where each sublist's elements are
 * all satisfied pairwise comparison according to the provided function.
 * Only adjacent elements are passed to the comparison function.
 *
 * @category Array
 * @data_last
 * @signature
 *   R.groupWith(fn)(array)
 * @param {Function} fn Function for determining whether two given (adjacent)
 *        elements should be in the same group
 * @return {Function} A function that takes a list and returns a list of lists
 *         where each sublist's elements are all satisfied pairwise comparison according to the provided function.
 * @example
 *
 * R.pipe([0, 1, 1, 2, 3, 5, 8, 13, 21], R.groupWith((a, b) => a === b))
 * //=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]
 *
 */
export function groupWith<T>(
  fn: (a: T, b: T) => boolean
): (list: readonly T[]) => T[];

export function groupWith() {
  return purry(_groupWith, arguments);
}
