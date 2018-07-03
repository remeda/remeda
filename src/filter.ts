type FilterFN<T> = (input: T) => boolean;

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param items The array to filter.
 * @param fn the callback function.
 * @signature
 *    R.filter(array, fn)
 * @example
 *    R.filter([1, 2, 3], x => x % 2 === 1) // => [1, 3]
 * @data_first
 */
export function filter<T, K>(items: T[], fn: (input: T) => K): K[];

/**
 * Filter the elements of an array that meet the condition specified in a callback function.
 * @param items The array to filter.
 * @signature
 *    R.filter(fn)(array)
 * @example
 *    R.filter(x => x % 2 === 1)([1, 2, 3]) // => [1, 3]
 * @data_last
 */
export function filter<T, K>(fn: (input: T) => K): (items: T[]) => K[];

export function filter<T>(
  arg1: T[] | FilterFN<T>,
  arg2?: T[] | FilterFN<T>
): T[] | ((items: T[]) => T[]) {
  if (arguments.length === 1) {
    return (items: T[]) => _filter(items, arg1 as FilterFN<T>);
  }
  return _filter(arg1 as T[], arg2 as FilterFN<T>);
}

function _filter<T>(items: T[], fn: (input: T) => boolean) {
  return items.filter(item => fn(item));
}
