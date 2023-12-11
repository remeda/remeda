import {
  CompareFunction,
  OrderRule,
  purryOrderRules,
} from './_purryOrderRules';
import type { IterableContainer, NonEmptyArray } from './_types';
import { hasAtLeast } from './hasAtLeast';

/**
 * Find the index for the first element in the array that adheres to the order rules provided.
 *
 * If you need the item itself prefer `firstBy`.
 *
 * @param data an array of items
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
 * @returns an index of the first element by the order criteria, or `-1` if the array is empty.
 * @signature
 *   R.firstIndexBy(data, ...rules);
 * @example
 *   const max = R.firstIndexBy([1,2,3], [R.identity, "desc"]); // => 2;
 *   const min = R.firstIndexBy([1,2,3], R.identity); // => 0;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = R.firstIndexBy(data, [(item) => item.a.length, "desc"]); // => 2;
 *   const minBy = R.firstIndexBy(data, (item) => item.a.length); // => 0;
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = R.firstIndexBy(data, R.prop('type'), [R.prop('size'), 'desc']); // => 1
 * @dataFirst
 * @category Array
 */
export function firstIndexBy<T extends IterableContainer>(
  data: T,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): number;

/**
 * Find the index for the first element in the array that adheres to the order rules provided.
 *
 * If you need the item itself prefer `firstBy`.
 *
 * @param data an array of items
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
 * @returns an index of the first element by the order criteria, or `-1` if the array is empty.
 * @signature
 *   R.firstIndexBy(...rules)(data);
 * @example
 *   const max = R.pipe([1,2,3], R.firstIndexBy([R.identity, "desc"])); // => 2;
 *   const min = R.pipe([1,2,3], R.firstIndexBy([1,2,3])); // => 0;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = R.pipe(data, R.firstIndexBy([(item) => item.a.length, "desc"])); // => 2;
 *   const minBy = R.pipe(data, R.firstIndexBy((item) => item.a.length)); // => 0;
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = R.pipe(data, R.firstIndexBy(R.prop('type'), [R.prop('size'), 'desc'])); // => 1
 * @dataLast
 * @category Array
 */
export function firstIndexBy<T extends IterableContainer>(
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (data: T) => number;

export function firstIndexBy(): unknown {
  return purryOrderRules(firstIndexByImplementation, arguments);
}

function firstIndexByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>
): number {
  if (!hasAtLeast(data, 1)) {
    // If we have 0 or 1 item we simply return the trivial result.
    return -1;
  }

  let currentIndex = 0;

  for (let i = 1; i < data.length; i++) {
    if (compareFn(data[i], data[currentIndex]) < 0) {
      // The item at i comes before the item at the current index in the order.
      currentIndex = i;
    }
  }

  return currentIndex;
}
