import {
  lastLazyValue,
  LAZY_EMPTY_EVALUATOR,
  makeStoppable,
  type StoppableLazyEvaluator,
} from "./internal/makeStoppable";
import { purryWithLazy2 } from "./internal/purryWithLazyByArity";
import type { IterableContainer } from "./internal/types/IterableContainer";

/**
 * Returns the first `n` elements of `data`.
 *
 * Related operations:
 * - `drop` - to skip past the first `n` instead.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `takeLast` - same, but from the end of the array.
 *
 * @param data - The array.
 * @param n - The number of elements to take.
 * @signature
 *    take(data, n)
 * @example
 *    take([1, 2, 3, 4, 3, 2, 1], 3) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function take<T extends IterableContainer>(
  data: T,
  n: number,
): T[number][];

/**
 * Returns the first `n` elements of `data`.
 *
 * Related operations:
 * - `drop` - to skip past the first `n` instead.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `takeLast` - same, but from the end of the array.
 *
 * @param n - The number of elements to take.
 * @signature
 *    take(n)(data)
 * @example
 *    pipe([1, 2, 3, 4, 3, 2, 1], take(3)) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function take(
  n: number,
): <T extends IterableContainer>(data: T) => T[number][];

export function take(dataOrN: IterableContainer | number, n?: number): unknown {
  return purryWithLazy2(
    takeImplementation,
    lazyImplementation,
    arguments.length,
    dataOrN,
    n,
  );
}

const takeImplementation = <T extends IterableContainer>(
  data: T,
  n: number,
): T[number][] => (n < 0 ? [] : data.slice(0, n));

const lazyImplementation = makeStoppable(
  <T>(n: number): StoppableLazyEvaluator<T> => {
    if (Number.isNaN(n) || n < 1) {
      return LAZY_EMPTY_EVALUATOR;
    }

    let remaining = n;
    return (value, _index, _data, slot) => {
      remaining -= 1;
      return remaining < 1 ? lastLazyValue(value, slot) : value;
    };
  },
);
