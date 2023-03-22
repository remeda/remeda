import { purry } from './purry';
import { NonEmptyArray } from './_types';

type Direction = 'asc' | 'desc';
type SortProjection<T> = (x: T) => Comparable;
type ComparablePrimitive = number | string | boolean;
type Comparable = ComparablePrimitive | { valueOf(): ComparablePrimitive };
type SortPair<T> = readonly [SortProjection<T>, Direction];
type SortRule<T> = SortProjection<T> | SortPair<T>;

const ASCENDING_COMPARATOR = <T>(x: T, y: T) => x > y;
const DESCENDING_COMPARATOR = <T>(x: T, y: T) => x < y;

/**
 * Sorts the list according to the supplied functions and directions.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 *
 * Directions are applied to functions in order and default to ascending if not specified.
 * @param sort first sort rule
 * @param sorts additional sort rules
 * @signature
 *    R.sortBy(...sorts)(array)
 * @example
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      R.sortBy(x => x.a)
 *    ) // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
 * @data_last
 * @category Array
 */
export function sortBy<T>(
  sort: SortRule<T>,
  ...sorts: Array<SortRule<T>>
): (array: ReadonlyArray<T>) => Array<T>;

/**
 * Sorts the list according to the supplied functions and directions.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 *
 * Directions are applied to functions in order and default to ascending if not specified.
 * @param array the array to sort
 * @param sorts a list of mapping functions and optional directions
 * @signature
 *    R.sortBy(array, ...sorts)
 * @example
 *    R.sortBy(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      x => x.a
 *    )
 *    // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
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
 *    //   {color: 'purple', weight: 1},
 *    //   {color: 'green', weight: 1},
 *    //   {color: 'red', weight: 2},
 *    //   {color: 'blue', weight: 3},
 * @data_first
 * @category Array
 */
export function sortBy<T>(
  array: ReadonlyArray<T>,
  ...sorts: Array<SortRule<T>>
): Array<T>;

export function sortBy<T>(
  arrayOrSort: ReadonlyArray<T> | SortRule<T>,
  ...sorts: Array<SortRule<T>>
): any {
  if (!isSortRule(arrayOrSort)) {
    return purry(_sortBy, [arrayOrSort, sorts]) as Array<T>;
  }
  return purry(_sortBy, [[arrayOrSort, ...sorts]]) as (
    arr: ReadonlyArray<T>
  ) => Array<T>;
}

function isSortRule<T>(x: ReadonlyArray<T> | SortRule<T>): x is SortRule<T> {
  if (typeof x == 'function') return true; // must be a SortProjection
  if (x.length != 2) return false; // cannot be a SortRule
  return typeof x[0] == 'function' && (x[1] === 'asc' || x[1] === 'desc');
}

function _sortBy<T>(
  array: Array<T>,
  sorts: NonEmptyArray<SortRule<T>>
): Array<T> {
  const copied = [...array];
  return copied.sort((a, b) => sortInternal(a, b, sorts[0], sorts.slice(1)));
}

function sortInternal<T>(
  a: T,
  b: T,
  sortRule: SortRule<T>,
  sortRules: Array<SortRule<T>>
): number {
  const [projector, direction] =
    typeof sortRule === 'function' ? [sortRule, 'asc' as const] : sortRule;

  const projectedA = projector(a);
  const projectedB = projector(b);

  const comparator =
    direction === 'asc' ? ASCENDING_COMPARATOR : DESCENDING_COMPARATOR;

  if (comparator(projectedA, projectedB)) {
    return 1;
  }

  if (comparator(projectedB, projectedA)) {
    return -1;
  }

  const [nextRule, ...remaining] = sortRules;
  return nextRule === undefined
    ? // We have no more rules to sort by so we have to consider the values as
      // equal
      0
    : sortInternal(a, b, nextRule, remaining);
}
