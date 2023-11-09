import type { IterableContainer, NonEmptyArray } from './_types';
import { purry } from './purry';

const ALL_DIRECTIONS = ['asc', 'desc'] as const;
type Direction = (typeof ALL_DIRECTIONS)[number];

type ComparablePrimitive = number | string | boolean;
type Comparable = ComparablePrimitive | { valueOf(): ComparablePrimitive };
type SortProjection<T> = (x: T) => Comparable;
type SortPair<T> = readonly [
  projector: SortProjection<T>,
  direction: Direction,
];
type SortRule<T> = SortProjection<T> | SortPair<T>;

const COMPARATOR = {
  asc: <T>(x: T, y: T) => x > y,
  desc: <T>(x: T, y: T) => x < y,
} as const;

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
  ...sortRules: Readonly<NonEmptyArray<SortRule<T>>>
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
  ...sortRules: Readonly<NonEmptyArray<SortRule<T>>>
): Array<T>;

export function sortBy<T>(
  arrayOrSortRule: ReadonlyArray<T> | SortRule<T>,
  ...sortRules: ReadonlyArray<SortRule<T>>
): unknown {
  const args = isSortRule(arrayOrSortRule)
    ? // *data-last invocation*: put all sort rules into a single array to be
      // passed as the first param.
      [[arrayOrSortRule, ...sortRules]]
    : // *data-first invocation*: put the arrayOrSort (which is array now) as
      // the first param, and all the sorts (as an array) into the second param.
      // `purry` would pick the right "flavour" based on the length of the
      // params tuple.
      [arrayOrSortRule, sortRules];

  return purry(_sortBy, args);
}

function isSortRule<T>(x: ReadonlyArray<T> | SortRule<T>): x is SortRule<T> {
  if (typeof x === 'function') {
    // must be a SortProjection
    return true;
  }

  const [maybeProjection, maybeDirection, ...rest] = x;

  if (rest.length > 0) {
    // Not a SortPair if we have more stuff in the array
    return false;
  }

  return (
    typeof maybeProjection === 'function' &&
    ALL_DIRECTIONS.indexOf(maybeDirection as Direction) !== -1
  );
}

const _sortBy = <T>(
  array: ReadonlyArray<T>,
  sorts: Readonly<NonEmptyArray<SortRule<T>>>
): Array<T> =>
  // Sort is done in-place so we need to copy the array.
  [...array].sort(comparer(...sorts));

function comparer<T>(
  primaryRule: SortRule<T>,
  secondaryRule?: SortRule<T>,
  ...otherRules: ReadonlyArray<SortRule<T>>
): (a: T, b: T) => number {
  const projector =
    typeof primaryRule === 'function' ? primaryRule : primaryRule[0];

  const direction = typeof primaryRule === 'function' ? 'asc' : primaryRule[1];
  const comparator = COMPARATOR[direction];

  const nextComparer =
    secondaryRule === undefined
      ? undefined
      : comparer(secondaryRule, ...otherRules);

  return (a, b) => {
    const projectedA = projector(a);
    const projectedB = projector(b);

    if (comparator(projectedA, projectedB)) {
      return 1;
    }

    if (comparator(projectedB, projectedA)) {
      return -1;
    }

    // The elements are equal base on the current comparator and projection. So
    // we need to check the elements using the next comparer, if one exists,
    // otherwise we consider them as true equal (returning 0).
    return nextComparer?.(a, b) ?? 0;
  };
}

interface Strict {
  <T extends IterableContainer>(
    ...sortRules: Readonly<NonEmptyArray<SortRule<T[number]>>>
  ): (array: T) => SortedBy<T>;

  <T extends IterableContainer>(
    array: T,
    ...sortRules: Readonly<NonEmptyArray<SortRule<T[number]>>>
  ): SortedBy<T>;
}

type SortedBy<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};

export namespace sortBy {
  export const strict: Strict = sortBy;
}
