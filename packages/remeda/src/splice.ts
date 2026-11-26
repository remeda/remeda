import type { DataLastBuilder } from "./internal/types/DataLastBuilder";

/**
 * Removes elements from an array and, optionally, inserts new elements in
 * their place.
 *
 * Related operations:
 * - `drop` - to skip past the first `n` elements.
 * - `dropLast` - to skip past the last `n` elements.
 * - `filter` - to shape the array by *value* rather than by *position*.
 * - `swapIndices` - to swap two elements by their indices.
 * - `take` - to keep only the first `n` elements.
 * - `takeLast` - to keep only the last `n` elements.
 *
 * @param data - The array to splice.
 * @param start - The index from which to start removing elements.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - Elements to insert at the cutoff point.
 * @signature
 *    splice(data, start, deleteCount);
 *    splice(data, start, deleteCount, replacement);
 * @example
 *    splice([1,2,3,4,5,6,7,8], 2, 3); //=> [1,2,6,7,8]
 *    splice([1,2,3,4,5,6,7,8], 2, 3, [9, 10]); //=> [1,2,9,10,6,7,8]
 * @dataFirst
 * @category Array
 */
export function splice<T extends readonly unknown[]>(
  data: T,
  start: number,
  deleteCount: number,
  replacement?: readonly T[number][],
): T[number][];

/**
 * Removes elements from an array and, optionally, inserts new elements in
 * their place.
 *
 * Related operations:
 * - `drop` - to skip past the first `n` elements.
 * - `dropLast` - to skip past the last `n` elements.
 * - `filter` - to shape the array by *value* rather than by *position*.
 * - `swapIndices` - to swap two elements by their indices.
 * - `take` - to keep only the first `n` elements.
 * - `takeLast` - to keep only the last `n` elements.
 *
 * @param start - The index from which to start removing elements.
 * @param deleteCount - The number of elements to remove.
 * @param replacement - Elements to insert at the cutoff point.
 * @signature
 *    splice(start, deleteCount)(data);
 *    splice(start, deleteCount, replacement)(data);
 * @example
 *    pipe([1,2,3,4,5,6,7,8], splice(2, 3)) // => [1,2,6,7,8]
 *    pipe([1,2,3,4,5,6,7,8], splice(2, 3, [9, 10])) // => [1,2,9,10,6,7,8]
 * @dataLast
 * @category Array
 */
export function splice<T extends readonly unknown[]>(
  start: number,
  deleteCount: number,
  replacement?: readonly T[number][],
): (data: T) => T[number][];

export function splice(
  dataOrStart: readonly unknown[] | number,
  startOrDeleteCount: number,
  // eslint-disable-next-line unicorn/no-non-function-verb-prefix -- Starts with `deleteCount`, `Array.prototype.splice`'s name for this parameter.
  deleteCountOrReplacement?: number | readonly unknown[],
  replacement?: readonly unknown[],
): unknown {
  // The optional `replacement` makes both call styles accept 3 arguments, so
  // the dispatch checks the type of the first one instead of the argument
  // count.
  return typeof dataOrStart === "number"
    ? dataLast(
        dataOrStart,
        startOrDeleteCount,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-last overload guarantees the rest.
        deleteCountOrReplacement,
      )
    : spliceImplementation(
        dataOrStart,
        startOrDeleteCount,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overload guarantees the rest.
        deleteCountOrReplacement,
        replacement,
      );
}

const dataLast: DataLastBuilder<typeof spliceImplementation> =
  // eslint-disable-next-line unicorn/no-non-function-verb-prefix -- `deleteCount` is `Array.prototype.splice`'s name for this parameter.
  (start, deleteCount, replacement) => (data) =>
    spliceImplementation(data, start, deleteCount, replacement);

function spliceImplementation<T extends readonly unknown[]>(
  data: T,
  start: number,
  // eslint-disable-next-line unicorn/no-non-function-verb-prefix -- `deleteCount` is `Array.prototype.splice`'s name for this parameter.
  deleteCount: number,
  replacement: readonly T[number][] = [],
): T[number][] {
  const result = data.concat();
  result.splice(start, deleteCount, ...replacement);
  return result;
}
