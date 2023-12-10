import { purryOrderRules, type OrderRule } from './_purryOrderRules';
import type { IterableContainer, NonEmptyArray } from './_types';

/**
 * Sorts the list according to the supplied functions and directions.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 *
 * Directions are applied to functions in order and default to ascending if not specified.
 *
 * If the input array is more complex (non-empty array, tuple, etc...) use the
 * strict mode to maintain it's shape.
 *
 * @param sortRule main sort rule
 * @param additionalSortRules subsequent sort rules (these are only relevant when two items are equal based on the previous sort rule)
 * @signature
 *    R.sortBy(sortRule, ...additionalSortRules)(array)
 *    R.sortBy.strict(sortRule, ...additionalSortRules)(array)
 * @example
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      R.sortBy(x => x.a)
 *    ) // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }] typed Array<{a:number}>
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }] as const,
 *      R.sortBy.strict(x => x.a)
 *    ) // => [{ a: 1 }, { a: 3 }] typed [{a: 1 | 3}, {a: 1 | 3}]
 * @dataLast
 * @category Array
 * @strict
 */
export function sortBy<T>(
  ...sortRules: Readonly<NonEmptyArray<OrderRule<T>>>
): (array: ReadonlyArray<T>) => Array<T>;

/**
 * Sorts the list according to the supplied functions and directions.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 *
 * Directions are applied to functions in order and default to ascending if not specified.
 *
 * If the input array is more complex (non-empty array, tuple, etc...) use the
 * strict mode to maintain it's shape.
 *
 * @param array the array to sort
 * @param sortRule main sort rule
 * @param additionalSortRules subsequent sort rules (these are only relevant when two items are equal based on the previous sort rule)
 * @signature
 *    R.sortBy(array, sortRule, ...additionalSortRules)
 *    R.sortBy.strict(array, sortRule, ...additionalSortRules)
 * @example
 *    R.sortBy(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      x => x.a
 *    )
 *    // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }] typed Array<{a:number}>
 *
 *    R.sortBy(
 *     [
 *       {color: 'red', weight: 2},
 *       {color: 'blue', weight: 3},
 *       {color: 'green', weight: 1},
 *       {color: 'purple', weight: 1},
 *     ],
 *      [x => x.weight, 'asc'], x => x.color
 *    )
 *    // =>
 *    //   {color: 'green', weight: 1},
 *    //   {color: 'purple', weight: 1},
 *    //   {color: 'red', weight: 2},
 *    //   {color: 'blue', weight: 3},
 *    // typed Array<{color: string, weight: number}>
 *
 *    R.sortBy.strict(
 *      [{ a: 1 }, { a: 3 }] as const,
 *      x => x.a
 *    )
 *    // => [{ a: 1 }, { a: 3 }] typed [{a: 1 | 3}, {a: 1 | 3}]
 * @dataFirst
 * @category Array
 * @strict
 */
export function sortBy<T>(
  array: ReadonlyArray<T>,
  ...sortRules: Readonly<NonEmptyArray<OrderRule<T>>>
): Array<T>;

export function sortBy(): unknown {
  return purryOrderRules(_sortBy, arguments);
}

const _sortBy = <T>(
  data: ReadonlyArray<T>,
  compareFn: (a: T, b: T) => number
): Array<T> =>
  // Sort is done in-place so we need to copy the array.
  [...data].sort(compareFn);

interface Strict {
  <T extends IterableContainer>(
    ...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
  ): (array: T) => SortedBy<T>;

  <T extends IterableContainer>(
    array: T,
    ...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
  ): SortedBy<T>;
}

type SortedBy<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};

export namespace sortBy {
  export const strict: Strict = sortBy;
}
