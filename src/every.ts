import type {
  Pred,
  PredIndexed,
  PredIndexedOptional,
  TypePred,
  TypePredIndexed,
} from "./_types";
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
  predicate: TypePred<T, S>,
): data is Array<S>;
export function every<T>(
  data: ReadonlyArray<T>,
  predicate: Pred<T, boolean>,
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
 * @example
 *    // using `R.every` as a type predicate within `conditional`
 *    const allNumbers = R.every(R.isNumber);
 *    const result = R.pipe(
 *      R.conditional(
 *        [allNumbers, val => {...}]
 *                  // ^? number[]
 *        ...
 *      )
 *    )
 * @dataLast
 * @indexed
 * @category Array
 */
export function every<T, S extends T>(
  predicate: TypePred<T, S>,
): (data: ReadonlyArray<T>) => data is Array<S>;
export function every<T>(
  predicate: (input: T) => boolean,
): (data: ReadonlyArray<T>) => boolean;

export function every(): unknown {
  return purry(_every(false), arguments);
}

const _every =
  (indexed: boolean) =>
  <T>(data: ReadonlyArray<T>, predicate: PredIndexedOptional<T, boolean>) =>
    indexed
      ? data.every((element, index, array) => predicate(element, index, array))
      : data.every((element) => predicate(element));

export namespace every {
  export function indexed<T, S extends T>(
    data: ReadonlyArray<T>,
    predicate: TypePredIndexed<T, S>,
  ): data is Array<S>;
  export function indexed<T>(
    data: ReadonlyArray<T>,
    predicate: PredIndexed<T, boolean>,
  ): boolean;
  export function indexed<T, S extends T>(
    predicate: TypePredIndexed<T, S>,
  ): (data: ReadonlyArray<T>) => data is Array<S>;
  export function indexed<T>(
    predicate: PredIndexed<T, boolean>,
  ): (data: ReadonlyArray<T>) => boolean;
  export function indexed(): unknown {
    return purry(_every(true), arguments);
  }
}
