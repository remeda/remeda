import { withLazyImplementation } from "./internal/lazyDataLastImplementation";
import { SKIP_ITEM } from "./internal/lazyControl";
import { requireData } from "./internal/requireData";
import type { Deduped } from "./internal/types/Deduped";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param data - The array to filter.
 * @param isEquals - The comparator.
 * @signature
 *    uniqueWith(array, isEquals)
 * @example
 *    uniqueWith(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *      equals,
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function uniqueWith<T extends IterableContainer>(
  data: T,
  isEquals: IsEquals<T[number]>,
): Deduped<T>;

/**
 * Returns a new array containing only one copy of each element in the original
 * list. Elements are compared by custom comparator isEquals.
 *
 * @param isEquals - The comparator.
 * @signature uniqueWith(isEquals)(array)
 * @example
 *    uniqueWith(equals)(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}],
 *    ) // => [{a: 1}, {a: 2}, {a: 5}, {a: 6}, {a: 7}]
 *    pipe(
 *      [{a: 1}, {a: 2}, {a: 2}, {a: 5}, {a: 1}, {a: 6}, {a: 7}], // only 4 iterations
 *      uniqueWith(equals),
 *      take(3)
 *    ) // => [{a: 1}, {a: 2}, {a: 5}]
 * @dataLast
 * @lazy
 * @category Array
 */
export function uniqueWith<T extends IterableContainer>(
  isEquals: IsEquals<T[number]>,
): (data: T) => Deduped<T>;

export function uniqueWith(
  dataOrIsEquals: unknown,
  isEquals?: unknown,
): unknown {
  return typeof dataOrIsEquals === "function"
    ? withLazyImplementation(
        dataLast(
          // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
          dataOrIsEquals,
        ),
        lazyImplementation,
        // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
        dataOrIsEquals,
      )
    : uniqueWithImplementation(
        // @ts-expect-error [ts2345] -- `typeof` tells the call styles apart but can't narrow the parameters to the implementation's types; the overloads guarantee them.
        dataOrIsEquals,
        isEquals,
      );
}

const dataLast =
  (
    // eslint-disable-next-line unicorn/consistent-boolean-name -- `isEquals` is the comparator function, named as in the implementation; the rule can't resolve the indexed access type to a function.
    isEquals: Parameters<typeof uniqueWithImplementation>[1],
  ) =>
  (data: Parameters<typeof uniqueWithImplementation>[0]) =>
    uniqueWithImplementation(data, isEquals);

const uniqueWithImplementation = <T>(
  data: readonly T[],
  isEquals: IsEquals<T>,
): T[] =>
  data.filter(
    (value, index) =>
      data.findIndex(
        (otherValue, otherIndex) =>
          index === otherIndex || isEquals(value, otherValue),
      ) === index,
  );

const lazyImplementation = <T>(isEquals: IsEquals<T>): LazyEvaluator<T> =>
  requireData((value, index, data) =>
    data.findIndex(
      (otherValue, otherIndex) =>
        index === otherIndex || isEquals(value, otherValue),
    ) === index
      ? value
      : SKIP_ITEM,
  );
