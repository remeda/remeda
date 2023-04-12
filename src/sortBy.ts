import { IterableContainer } from './_types';
import { purry } from './purry';

type Direction = 'asc' | 'desc';
type SortProjection<T> = (x: T) => Comparable;
type ComparablePrimitive = number | string | boolean;
type Comparable = ComparablePrimitive | { valueOf(): ComparablePrimitive };
type SortPair<T> = readonly [SortProjection<T>, Direction];
type SortRule<T> = SortProjection<T> | SortPair<T>;

/**
 * Sorts the list according to the supplied functions and directions.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 *
 * Directions are applied to functions in order and default to ascending if not specified.
 *
 * If the input array is more complex (non-empty array, tuple, etc...) use the
 * strict mode to maintain it's shape.
 *
 * @param sort first sort rule
 * @param sorts additional sort rules
 * @signature
 *    R.sortBy(...sorts)(array)
 *    R.sortBy.strict(...sorts)(array)
 * @example
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      R.sortBy(x => x.a)
 *    ) // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }] typed Array<{a:number}>
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }] as const,
 *      R.sortBy(x => x.a)
 *    ) // => [{ a: 1 }, { a: 3 }] typed [{a: 1 | 3}, {a: 1 | 3}]
 * @data_last
 * @category Array
 * @strict
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
 *
 * If the input array is more complex (non-empty array, tuple, etc...) use the
 * strict mode to maintain it's shape.
 *
 * @param array the array to sort
 * @param sorts a list of mapping functions and optional directions
 * @signature
 *    R.sortBy(array, ...sorts)
 *    R.sortBy.strict(array, ...sorts)
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
 *    //   {color: 'purple', weight: 1},
 *    //   {color: 'green', weight: 1},
 *    //   {color: 'red', weight: 2},
 *    //   {color: 'blue', weight: 3},
 *    // typed Array<{color: string, weight: number}>
 *
 *    R.sortBy.strict(
 *      [{ a: 1 }, { a: 3 }] as const,
 *      x => x.a
 *    )
 *    // => [{ a: 1 }, { a: 3 }] typed [{a: 1 | 3}, {a: 1 | 3}]
 * @data_first
 * @category Array
 * @strict
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

function _sortBy<T>(array: Array<T>, sorts: Array<SortRule<T>>): Array<T> {
  const sort = (
    a: T,
    b: T,
    sortRule: SortRule<T>,
    sortRules: Array<SortRule<T>>
  ): number => {
    let fn: SortProjection<T>;
    let direction: Direction;
    if (Array.isArray(sortRule)) {
      [fn, direction] = sortRule as SortPair<T>;
    } else {
      direction = 'asc';
      fn = sortRule as SortProjection<T>;
    }
    const dir: (x: Comparable, y: Comparable) => boolean =
      direction !== 'desc' ? (x, y) => x > y : (x, y) => x < y;
    if (!fn) {
      return 0;
    }
    if (dir(fn(a), fn(b))) {
      return 1;
    }
    if (dir(fn(b), fn(a))) {
      return -1;
    }
    return sort(a, b, sortRules[0], sortRules.slice(1));
  };
  const copied = [...array];
  return copied.sort((a: T, b: T) => sort(a, b, sorts[0], sorts.slice(1)));
}

interface Strict {
  <T extends IterableContainer>(
    sort: SortRule<T[number]>,
    ...sorts: Array<SortRule<T[number]>>
  ): (data: T) => SortedBy<T>;

  <T extends IterableContainer>(
    data: T,
    ...sorts: Array<SortRule<T[number]>>
  ): SortedBy<T>;
}

type SortedBy<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};

export namespace sortBy {
  export const strict: Strict = sortBy;
}
