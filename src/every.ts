import type { PredIndexed } from "./_types";
import { purry } from "./purry";

type TypePredIndexed<T, S extends T> = (
  input: T,
  index: number,
  array: ReadonlyArray<T>,
) => input is S;

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
  predicate: TypePredIndexed<T, S>,
): data is Array<S>;
export function every<T>(
  data: ReadonlyArray<T>,
  predicate: PredIndexed<T, boolean>,
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
  predicate: TypePredIndexed<T, S>,
): (data: ReadonlyArray<T>) => data is Array<S>;
export function every<T>(
  predicate: PredIndexed<T, boolean>,
): (data: ReadonlyArray<T>) => boolean;

export function every(): unknown {
  return purry(everyImplementation, arguments);
}

const everyImplementation = <T>(
  data: ReadonlyArray<T>,
  predicate: PredIndexed<T, boolean>,
): boolean =>
  data.every((element, index, array) => predicate(element, index, array));
