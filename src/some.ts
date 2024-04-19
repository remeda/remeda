import type { Pred, PredIndexed, PredIndexedOptional } from "./_types";
import { purry } from "./purry";

/**
 * Checks if at least one element of `data` passed the predicate `predicate`.
 *
 * @param data - The Array to check.
 * @param predicate - A predicate function to run.
 * @returns A `boolean` indicating if at least one element in `data` passes the predicate `pred`.
 * @signature
 *    R.some(arr, predicate)
 * @example
 *    R.some([1, 2, 3], R.isNumber) // => true
 *    R.some(['a', 0, 'b'], R.isString) // => true
 * @dataFirst
 * @indexed
 * @category Array
 */
export function some<T>(
  data: ReadonlyArray<T>,
  predicate: Pred<T, boolean>,
): boolean;

/**
 * Checks if at least one element of `data` passed the predicate `predicate`.
 *
 * @param predicate - A predicate function to run.
 * @returns A `boolean` indicating if at least one element in `data` passes the predicate `pred`.
 * @signature
 *    R.some(predicate)(data)
 * @example
 *    R.some(isNumber)([1, 2, 3]) // => true
 *    R.some(isString)(['a', 0, 'b']) // => true
 * @example
 *    // using `R.some` as a type predicate within `conditional`
 *    const result = R.pipe(
 *      data,
 *      R.conditional(
 *        [some(isNumber), val => {...}]
 *        ...
 *      )
 *    )
 * @dataLast
 * @indexed
 * @category Array
 */
export function some<T>(
  predicate: (input: T) => boolean,
): (data: ReadonlyArray<T>) => boolean;

export function some(): unknown {
  return purry(_some(false), arguments);
}

const _some =
  (indexed: boolean) =>
  <T>(data: ReadonlyArray<T>, predicate: PredIndexedOptional<T, boolean>) =>
    indexed
      ? data.some((element, index, array) => predicate(element, index, array))
      : data.some((element) => predicate(element));

export namespace some {
  export function indexed<T>(
    data: ReadonlyArray<T>,
    predicate: PredIndexed<T, boolean>,
  ): boolean;
  export function indexed<T>(
    predicate: PredIndexed<T, boolean>,
  ): (data: ReadonlyArray<T>) => boolean;
  export function indexed(): unknown {
    return purry(_some(true), arguments);
  }
}
