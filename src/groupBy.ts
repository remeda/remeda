import { purry } from './purry';

/**
 * Splits a collection into sets, grouped by the result of running each value through `fn`.
 * @param items the items to group
 * @param fn the grouping function
 * @signature
 *    R.groupBy(array, fn)
 * @example
 *    R.groupBy(['one', 'two', 'three'], x => x.length) => {3: ['one', 'two'], 5: ['three']}
 * @data_first
 * @category Array
 */
export function groupBy<T>(
  items: T[],
  fn: (item: T) => any
): Record<string, T[]>;

export function groupBy<T>(
  fn: (item: T) => any
): (array: T[]) => Record<string, T[]>;

/**
 * Splits a collection into sets, grouped by the result of running each value through `fn`.
 * @param fn the grouping function
 * @signature
 *    R.groupBy(array, fn)
 * @example
 *    R.pipe(['one', 'two', 'three'], R.groupBy(x => x.length)) => {3: ['one', 'two'], 5: ['three']}
 * @data_last
 * @category Array
 */
export function groupBy() {
  return purry(_groupBy, arguments);
}

function _groupBy<T>(array: T[], fn: (item: T) => any) {
  const ret: Record<string, T[]> = {};
  array.forEach(item => {
    const key = fn(item).toString();
    if (!ret[key]) {
      ret[key] = [];
    }
    ret[key].push(item);
  });
  return ret;
}

declare module './groupBy' {
  namespace groupBy { export var indexed: () => 1; }
}
