import { manyLazyValues, type LazyResult } from "./internal/lazyControl";
import { withLazyImplementation } from "./internal/lazyDataLastImplementation";
import { requireDataByArity } from "./internal/requireData";
import type { ArrayCallback } from "./internal/types/ArrayCallback";
import type { DataLastBuilder } from "./internal/types/DataLastBuilder";
import type { LazyCallback } from "./internal/types/LazyCallback";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param data - The items to map and flatten.
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    flatMap(data, callbackfn)
 * @example
 *    flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function flatMap<T, U>(
  data: readonly T[],
  callbackfn: ArrayCallback<readonly T[], readonly U[] | U>,
): U[];

/**
 * Returns a new array formed by applying a given callback function to each
 * element of the array, and then flattening the result by one level. It is
 * identical to a `map` followed by a `flat` of depth 1
 * (`flat(map(data, ...args))`), but slightly more efficient than calling those
 * two methods separately. Equivalent to `Array.prototype.flatMap`.
 *
 * @param callbackfn - A function to execute for each element in the array. It
 * should return an array containing new elements of the new array, or a single
 * non-array value to be added to the new array.
 * @returns A new array with each element being the result of the callback
 * function and flattened by a depth of 1.
 * @signature
 *    flatMap(callbackfn)(data)
 * @example
 *    pipe([1, 2, 3], flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @dataLast
 * @lazy
 * @category Array
 */
export function flatMap<T, U>(
  callbackfn: LazyCallback<readonly T[], readonly U[] | U>,
): (data: readonly T[]) => U[];

export function flatMap(
  dataOrCallbackfn: readonly unknown[] | LazyCallback<readonly unknown[]>,
  callbackfn?: ArrayCallback<readonly unknown[]>,
): unknown {
  return typeof dataOrCallbackfn === "function"
    ? withLazyImplementation(
        dataLast(
          // @ts-expect-error [ts2345] -- Run eagerly, the data-last function hands the callback the complete input, a valid non-empty prefix whenever the callback is invoked (it never is for an empty input); TypeScript can't relate `T` to `NonEmptyPrefix<T>`.
          dataOrCallbackfn,
        ),
        lazyImplementation,
        // @ts-expect-error [ts2345] -- `lazyImplementation` invokes the callback only once the input has an item, so the prefix it passes is never empty; TypeScript can't tell from its `readonly T[]` type.
        dataOrCallbackfn,
      )
    : flatMapImplementation(
        dataOrCallbackfn,
        // @ts-expect-error [ts2345] -- `typeof` narrows only the first parameter; the data-first overloads guarantee the rest.
        callbackfn,
      );
}

const dataLast: DataLastBuilder<typeof flatMapImplementation> =
  (callbackfn) => (data) =>
    flatMapImplementation(data, callbackfn);

const flatMapImplementation = <T, U>(
  data: readonly T[],
  callbackfn: (value: T, index: number, data: readonly T[]) => readonly U[] | U,
): U[] => data.flatMap(callbackfn);

const lazyImplementation = <T, K>(
  callbackfn: (input: T, index: number, data: readonly T[]) => K | readonly K[],
): LazyEvaluator<T, K> =>
  requireDataByArity(
    callbackfn,
    2,
    (value, index, data, slot): LazyResult<K> => {
      const mapped = callbackfn(value, index, data);
      return Array.isArray(mapped)
        ? manyLazyValues(mapped, slot)
        : // @ts-expect-error [ts2322] -- Array.isArray doesn't narrow readonly
          // arrays (https://github.com/microsoft/TypeScript/issues/17002), so
          // `mapped` is still typed as K | readonly K[] here even though it is
          // never an array at runtime.
          mapped;
    },
  );
