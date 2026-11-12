import { SKIP_ITEM } from "./internal/lazyControl";
import { purryWithLazy3 } from "./internal/purryWithLazyByArity";
import type { IsEqualFunction } from "./internal/types/IsEqualFunction";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param data - The source array.
 * @param other - The values to exclude.
 * @param isEqual - The comparator.
 * @signature
 *    differenceWith(data, other, isEqual)
 * @example
 *    differenceWith(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }],
 *      [2, 5, 3],
 *      ({ a }, b) => a === b,
 *    ); //=> [{ a: 1 }, { a: 4 }]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function differenceWith<T, Other>(
  data: readonly T[],
  other: readonly Other[],
  isEqual: IsEqualFunction<T, Other>,
): T[];

/**
 * Excludes the values from `other` array.
 * Elements are compared by custom comparator isEquals.
 *
 * @param other - The values to exclude.
 * @param isEqual - The comparator.
 * @signature
 *    differenceWith(other, isEqual)(data)
 * @example
 *    pipe(
 *      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
 *      differenceWith([2, 3], ({ a }, b) => a === b),
 *    ); //=> [{ a: 1 }, { a: 4 }, { a: 5 }, { a: 6 }]
 * @dataLast
 * @lazy
 * @category Array
 */
export function differenceWith<T, Other>(
  other: readonly Other[],
  isEqual: IsEqualFunction<T, Other>,
): (data: readonly T[]) => T[];

export function differenceWith(
  dataOrOther: readonly unknown[],
  otherOrIsEqual?: readonly unknown[] | IsEqualFunction,
  isEqual?: IsEqualFunction,
): unknown {
  return purryWithLazy3(
    differenceWithImplementation,
    lazyImplementation,
    arguments.length,
    dataOrOther,
    otherOrIsEqual,
    isEqual,
  );
}

function differenceWithImplementation<T, Other>(
  data: readonly T[],
  other: readonly Other[],
  isEqual: IsEqualFunction<T, Other>,
): T[] {
  const result: T[] = [];
  for (const value of data) {
    if (other.every((otherValue) => !isEqual(value, otherValue))) {
      result.push(value);
    }
  }
  return result;
}

const lazyImplementation =
  <T, Other>([other, isEqual]: readonly [
    other: readonly Other[],
    isEqual: IsEqualFunction<T, Other>,
  ]): LazyEvaluator<T> =>
  (value) =>
    other.every((otherValue) => !isEqual(value, otherValue))
      ? value
      : SKIP_ITEM;
