import doTransduce from "./internal/doTransduce";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Merge two or more arrays. This method does not change the existing arrays,
 * but instead returns a new array, even if the other array is empty.
 *
 * @param data - The first items, these would be at the beginning of the new
 * array.
 * @param other - The remaining items, these would be at the end of the new
 * array.
 * @returns A new array with the items of the first array followed by the items
 * of the second array.
 * @signature
 *    R.concat(data, other);
 * @example
 *    R.concat([1, 2, 3], ['a']) // [1, 2, 3, 'a']
 * @dataFirst
 * @lazy
 * @category Array
 */
export function concat<
  T1 extends IterableContainer,
  T2 extends IterableContainer,
>(data: T1, other: T2): [...T1, ...T2];
export function concat<T1, T2>(
  data: Iterable<T1>,
  other: Iterable<T2>,
): Array<T1 | T2>;

/**
 * Merge two or more arrays. This method does not change the existing arrays,
 * but instead returns a new array, even if the other array is empty.
 *
 * @param other - The remaining items, these would be at the end of the new
 * array.
 * @returns A new array with the items of the first array followed by the items
 * of the second array.
 * @signature
 *    R.concat(arr2)(arr1);
 * @example
 *    R.concat(['a'])([1, 2, 3]) // [1, 2, 3, 'a']
 * @dataLast
 * @lazy
 * @category Array
 */
export function concat<T2 extends IterableContainer>(
  other: T2,
): <T1 extends IterableContainer>(data: T1) => [...T1, ...T2];
export function concat<T2>(
  other: Iterable<T2>,
): <T1>(data: Iterable<T1>) => Array<T1 | T2>;

export function concat(...args: ReadonlyArray<unknown>): unknown {
  return doTransduce(concatImplementation, lazyImplementation, args);
}

function concatImplementation<T1, T2>(
  data: Iterable<T1>,
  other: Iterable<T2>,
): Array<T1 | T2> {
  return [...data, ...other];
}

function* lazyImplementation<T1, T2>(
  data: Iterable<T1>,
  other: Iterable<T2>,
): Iterable<T1 | T2> {
  yield* data;
  yield* other;
}
