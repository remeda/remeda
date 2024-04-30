import { purry } from "./purry";

/**
 * Checks if every element of `data` passed the predicate `predicate`.
 *
 * @param data - The Array to check.
 * @param predicate - A predicate function to run.
 * @returns A `boolean` indicating if every element in `data` passes the predicate `pred`.
 * @signature
 *    R.every(arr, predicate)
 * @example
 *    R.every([1, 2, 3], R.isNumber) // => true
 *    R.every(['a', 0, 'b'], R.isString) // => false
 * @dataFirst
 * @indexed
 * @category Array
 */
export function every<T, S extends T>(
  data: ReadonlyArray<T>,
  predicate: (input: T, index: number, array: ReadonlyArray<T>) => input is S,
): data is Array<S>;
export function every<T>(
  data: ReadonlyArray<T>,
  predicate: (input: T, index: number, array: ReadonlyArray<T>) => boolean,
): boolean;

/**
 * Checks if every element of `data` passed the predicate `predicate`.
 *
 * @param predicate - A predicate function to run.
 * @returns A `boolean` indicating if every element in `data` passes the predicate `pred`.
 * @signature
 *    R.every(predicate)(data)
 * @example
 *    R.every(isNumber)([1, 2, 3]) // => true
 *    R.every(isString)(['a', 0, 'b']) // => false
 * @dataLast
 * @indexed
 * @category Array
 */
export function every<T, S extends T>(
  predicate: (input: T, index: number, array: ReadonlyArray<T>) => input is S,
): (data: ReadonlyArray<T>) => data is Array<S>;
export function every<T>(
  predicate: (input: T, index: number, array: ReadonlyArray<T>) => boolean,
): (data: ReadonlyArray<T>) => boolean;

export function every(): unknown {
  return purry(everyImplementation, arguments);
}

const everyImplementation = <T>(
  data: ReadonlyArray<T>,
  predicate: (input: T, index: number, array: ReadonlyArray<T>) => boolean,
  // eslint-disable-next-line unicorn/no-array-callback-reference
): boolean => data.every(predicate);
