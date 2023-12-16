import {
  CompareFunction,
  OrderRule,
  purryOrderRules,
} from './_purryOrderRules';
import type { IterableContainer, NonEmptyArray } from './_types';
import { hasAtLeast } from './hasAtLeast';

type FirstBy<T extends IterableContainer> =
  | T[number]
  | (T extends readonly [unknown, ...ReadonlyArray<unknown>]
      ? never
      : T extends readonly [...ReadonlyArray<unknown>, unknown]
        ? never
        : undefined);

/**
 * Find the first element in the array that adheres to the order rules provided. This is a superset of what a typical `maxBy` or `minBy` function would do as it allows defining "tie-breaker" rules when values are equal, and allows comparing items using any logic.
 *
 * If you just need the offset in the array where the first element would be found use `firstIndexBy`.
 *
 * **This function is equivalent to calling `R.first(R.sortBy(...))` but runs at
 * O(n) instead of O(nlogn).**
 *
 * @param data an array of items
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
 * @returns the first element by the order criteria, or `undefined` if the array
 * is empty. (The function provides strong typing if the input type assures the
 * array isn't empty).
 * @signature
 *   R.firstBy(...rules)(data);
 * @example
 *   const max = R.pipe([1,2,3], R.firstBy([R.identity, "desc"])); // => 3;
 *   const min = R.pipe([1,2,3], R.firstBy([1,2,3])); // => 1;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = R.pipe(data, R.firstBy([(item) => item.a.length, "desc"])); // => { a: "aaa" };
 *   const minBy = R.pipe(data, R.firstBy((item) => item.a.length)); // => { a: "a" };
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = R.pipe(data, R.firstBy(R.prop('type'), [R.prop('size'), 'desc'])); // => {type: "cat", size: 2}
 * @dataLast
 * @category Array
 */
export function firstBy<T extends IterableContainer>(
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (data: T) => FirstBy<T>;

/**
 * Find the first element in the array that adheres to the order rules provided. This is a superset of what a typical `maxBy` or `minBy` function would do as it allows defining "tie-breaker" rules when values are equal, and allows comparing items using any logic.
 *
 * If you just need the offset in the array where the first element would be found use `firstIndexBy`.
 *
 * **This function is equivalent to calling `R.first(R.sortBy(...))` but runs at
 * O(n) instead of O(nlogn).**
 *
 * Use `atIndexBy` or `takeBy` if you more than just the first element.
 *
 * @param data an array of items
 * @param rules a variadic set of ordering rules (defined as functions), starting from the most important, that define the ordering criteria by which to consider the elements in the array. Values are considered in ascending order based on the natural order of the values. If you need them in descending order use the `[fn, "desc"]` syntax.
 * @returns the first element by the order criteria, or `undefined` if the array
 * is empty. (The function provides strong typing if the input type assures the
 * array isn't empty).
 * @signature
 *   R.firstBy(data, ...rules);
 * @example
 *   const max = R.firstBy([1,2,3], [R.identity, "desc"]); // => 3;
 *   const min = R.firstBy([1,2,3], R.identity); // => 1;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = R.firstBy(data, [(item) => item.a.length, "desc"]); // => { a: "aaa" };
 *   const minBy = R.firstBy(data, (item) => item.a.length); // => { a: "a" };
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = R.firstBy(data, R.prop('type'), [R.prop('size'), 'desc']); // => {type: "cat", size: 2}
 * @dataFirst
 * @category Array
 */
export function firstBy<T extends IterableContainer>(
  data: T,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): FirstBy<T>;

export function firstBy(): unknown {
  return purryOrderRules(firstByImplementation, arguments);
}

function firstByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>
): T | undefined {
  let [currentFirst] = data;

  if (!hasAtLeast(data, 2)) {
    // If we have 0 or 1 item we simply return the trivial result.
    return currentFirst;
  }

  // Remove the first item, we won't compare it with itself.
  const [, ...rest] = data;
  for (const item of rest) {
    if (compareFn(item, currentFirst) < 0) {
      // item comes before currentFirst in the order.
      currentFirst = item;
    }
  }

  return currentFirst;
}
