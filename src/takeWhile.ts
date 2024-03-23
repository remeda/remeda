import { purry } from "./purry";

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.takeWhile(data, predicate)
 * @example
 *    R.takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4) // => [1, 2, 3]
 * @dataFirst
 * @category Array
 */
export function takeWhile<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T>;

/**
 * Returns elements from the array until predicate returns false.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.takeWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 3, 4, 3, 2, 1], R.takeWhile(x => x !== 4))  // => [1, 2, 3]
 * @dataLast
 * @category Array
 */
export function takeWhile<T>(
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): (array: ReadonlyArray<T>) => Array<T>;

export function takeWhile(): unknown {
  return purry(takeWhileImplementation, arguments);
}

function takeWhileImplementation<T>(
  data: ReadonlyArray<T>,
  predicate: (item: T, index: number, data: ReadonlyArray<T>) => boolean,
): Array<T> {
  const ret: Array<T> = [];
  for (let i = 0; i < data.length; i++) {
    // TODO: Use entries once we bump our typescript target.
    const item = data[i]!;
    if (!predicate(item, i, data)) {
      break;
    }
    ret.push(item);
  }
  return ret;
}
