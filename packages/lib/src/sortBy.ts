import { purryOrderRules, type OrderRule } from "./internal/purryOrderRules";
import type { CompareFunction } from "./internal/types/CompareFunction";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";
import type { ReorderedArray } from "./internal/types/ReorderedArray";

/**
 * Sorts `data` using the provided ordering rules. The `sort` is done via the
 * native `Array.prototype.sort` but is performed on a shallow copy of the array
 * to avoid mutating the original data.
 *
 * There are several other functions that take order rules and **bypass** the
 * need to sort the array first (in *O(nlogn)* time):
 * * `firstBy` === `first(sortBy(data, ...rules))`, O(n).
 * * `takeFirstBy` === `take(sortBy(data, ...rules), k)`, O(nlogk).
 * * `dropFirstBy` === `drop(sortBy(data, ...rules), k)`, O(nlogk).
 * * `nthBy` === `sortBy(data, ...rules).at(k)`, O(n).
 * * `rankBy` === `sortedIndex(sortBy(data, ...rules), item)`, O(n).
 * Refer to the docs for more details.
 *
 * @param sortRules - A variadic array of order rules defining the sorting
 * criteria. Each order rule is a projection function that extracts a comparable
 * value from the data. Sorting is based on these extracted values using the
 * native `<` and `>` operators. Earlier rules take precedence over later ones.
 * Use the syntax `[projection, "desc"]` for descending order.
 * @returns A shallow copy of the input array sorted by the provided rules.
 * @signature
 *    R.sortBy(...rules)(data)
 * @example
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      R.sortBy(R.prop('a')),
 *    ); // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
 * @dataLast
 * @category Array
 */
export function sortBy<T extends IterableContainer>(
  ...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (array: T) => ReorderedArray<T>;

/**
 * Sorts `data` using the provided ordering rules. The `sort` is done via the
 * native `Array.prototype.sort` but is performed on a shallow copy of the array
 * to avoid mutating the original data.
 *
 * There are several other functions that take order rules and **bypass** the
 * need to sort the array first (in *O(nlogn)* time):
 * * `firstBy` === `first(sortBy(data, ...rules))`, O(n).
 * * `takeFirstBy` === `take(sortBy(data, ...rules), k)`, O(nlogk).
 * * `dropFirstBy` === `drop(sortBy(data, ...rules), k)`, O(nlogk).
 * * `nthBy` === `sortBy(data, ...rules).at(k)`, O(n).
 * * `rankBy` === `sortedIndex(sortBy(data, ...rules), item)`, O(n).
 * Refer to the docs for more details.
 *
 * @param array - The input array.
 * @param sortRules - A variadic array of order rules defining the sorting
 * criteria. Each order rule is a projection function that extracts a comparable
 * value from the data. Sorting is based on these extracted values using the
 * native `<` and `>` operators. Earlier rules take precedence over later ones.
 * Use the syntax `[projection, "desc"]` for descending order.
 * @returns A shallow copy of the input array sorted by the provided rules.
 * @signature
 *    R.sortBy(data, ...rules)
 * @example
 *    R.sortBy(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      prop('a'),
 *    );  // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
 *    R.sortBy(
 *      [
 *        {color: 'red', weight: 2},
 *        {color: 'blue', weight: 3},
 *        {color: 'green', weight: 1},
 *        {color: 'purple', weight: 1},
 *      ],
 *      [prop('weight'), 'asc'],
 *      prop('color'),
 *    ); // => [
 *    //   {color: 'green', weight: 1},
 *    //   {color: 'purple', weight: 1},
 *    //   {color: 'red', weight: 2},
 *    //   {color: 'blue', weight: 3},
 *    // ]
 * @dataFirst
 * @category Array
 */
export function sortBy<T extends IterableContainer>(
  array: T,
  ...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): ReorderedArray<T>;

export function sortBy(...args: ReadonlyArray<unknown>): unknown {
  return purryOrderRules(sortByImplementation, args);
}

const sortByImplementation = <T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
): Array<T> =>
  // TODO [2025-05-01]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.toSorted` here.
  [...data].sort(compareFn);
