import { purry } from './purry';

type Direction = 'asc' | 'desc';
type SortProjection<T> = (x: T) => Sortable;
type SortablePrimitive = number | string;
type Sortable = SortablePrimitive | { valueOf(): SortablePrimitive };

/**
 * Sorts the list according to the supplied functions and directions.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 *
 * Directions are applied to functions in order and default to ascending if not specified.
 * @param array the array to sort
 * @param fnDirs a list of mapping functions and directions
 * @signature
 *    R.sortBy(array, ...fnDirs)
 * @example
 *    R.sortBy(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      x => x.a
 *    )
 *    // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
 *
 *    R.sortBy(
 *     const objects = [
 *       {color: 'red', weight: 2},
 *       {color: 'blue', weight: 3},
 *       {color: 'green', weight: 1},
 *       {color: 'purple', weight: 1},
 *     ];
 *      x => x.weight, 'asc', x.color, 'desc'
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
  array: readonly T[],
  ...fnDirs: (SortProjection<T> | Direction)[]
): T[];

/**
 * Sorts the list according to the supplied functions and directions.
 * Sorting is based on a native `sort` function. It's not guaranteed to be stable.
 *
 * Directions are applied to functions in order and default to ascending if not specified.
 * @param fnDir first mapping function or direction
 * @param fnDirs additional mapping function
 * @signature
 *    R.sortBy(...fnDirs)(array)
 * @example
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      R.sortBy(x => x.a)
 *    ) // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }]
 * @data_last
 * @category Array
 */
export function sortBy<T>(
  fnDir: SortProjection<T> | Direction,
  ...fnDirs: (SortProjection<T> | Direction)[]
): (array: readonly T[]) => T[];

export function sortBy() {
  if (Array.isArray(arguments[0])) {
    return purry(_sortBy, [arguments[0], Array.from(arguments).slice(1)]);
  }
  return purry(_sortBy, [Array.from(arguments)]);
}

function _sortBy<T>(
  array: T[],
  fnDirs: (SortProjection<T> | Direction)[]
): T[] {
  let _fns: SortProjection<T>[] = fnDirs.filter(
    x => x instanceof Function
  ) as SortProjection<T>[];
  const _directions: Direction[] = fnDirs.filter(
    x => !(x instanceof Function)
  ) as Direction[];
  const sort = (
    a: T,
    b: T,
    fn: SortProjection<T>,
    fns: SortProjection<T>[],
    direction: Direction,
    directions: Direction[]
  ): number => {
    const dir: (x: Sortable, y: Sortable) => boolean =
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
    return sort(a, b, fns[0], fns.slice(1), directions[0], directions.slice(1));
  };
  const copied = [...array];
  return copied.sort((a: T, b: T) =>
    sort(a, b, _fns[0], _fns.slice(1), _directions[0], _directions.slice(1))
  );
}
