import { purry } from './purry';

/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 * @param array the array to reduce
 * @param fn the callback function
 * @param initialValue the initial value to use as an accumulator value in the callback function
 * @signature
 *    R.reduce(items, fn, initialValue)
 *    R.reduce.indexed(items, fn, initialValue)
 * @example
 *    R.reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 100) // => 115
 *    R.reduce.indexed([1, 2, 3, 4, 5], (acc, x, i, array) => acc + x, 100) // => 115
 * @data_first
 * @indexed
 * @category Array
 */
export function reduce<T, K>(
  items: readonly T[],
  fn: (acc: K, item: T) => K,
  initialValue: K
): K;

/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 * @param fn the callback function
 * @param initialValue the initial value to use as an accumulator value in the callback function
 * @signature
 *    R.reduce(fn, initialValue)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 5], R.reduce((acc, x) => acc + x, 100)) // => 115
 *    R.pipe([1, 2, 3, 4, 5], R.reduce.indexed((acc, x, i, array) => acc + x, 100)) // => 115
 * @data_last
 * @indexed
 * @category Array
 */
export function reduce<T, K>(
  fn: (acc: K, item: T) => K,
  initialValue: K
): (items: readonly T[]) => K;

export function reduce() {
  return purry(_reduce(false), arguments);
}

const _reduce = (indexed: boolean) => <T, K>(
  items: T[],
  fn: (acc: K, item: T, index?: number, items?: T[]) => K,
  initialValue: K
): K => {
  return items.reduce(
    (acc, item, index) =>
      indexed ? fn(acc, item, index, items) : fn(acc, item),
    initialValue
  );
};

export namespace reduce {
  export function indexed<T, K>(
    array: readonly T[],
    fn: (acc: K, item: T, index: number, items: T[]) => K,
    initialValue: K
  ): Record<string, T>;
  export function indexed<T, K>(
    fn: (acc: K, item: T, index: number, items: T[]) => K,
    initialValue: K
  ): (array: readonly T[]) => Record<string, T>;
  export function indexed() {
    return purry(_reduce(true), arguments);
  }
}
