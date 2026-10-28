import { SKIP_ITEM } from "./internal/lazyControl";
import { purryWithLazy } from "./internal/purryWithLazy";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";

/**
 * Removes last `n` elements from the `array`.
 *
 * Related operations:
 * - `drop` - same, but from the start of the array.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `takeLast` - to keep the last `n` instead.
 *
 * @param array - The target array.
 * @param n - The number of elements to skip.
 * @signature
 *    dropLast(array, n)
 * @example
 *    dropLast([1, 2, 3, 4, 5], 2) // => [1, 2, 3]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function dropLast<T extends IterableContainer>(
  array: T,
  n: number,
): T[number][];

/**
 * Removes last `n` elements from the `array`.
 *
 * Related operations:
 * - `drop` - same, but from the start of the array.
 * - `splice` - to remove or insert at an arbitrary index.
 * - `takeLast` - to keep the last `n` instead.
 *
 * @param n - The number of elements to skip.
 * @signature
 *    dropLast(n)(array)
 * @example
 *    dropLast(2)([1, 2, 3, 4, 5]) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function dropLast(
  n: number,
): <T extends IterableContainer>(array: T) => T[number][];

export function dropLast(...args: readonly unknown[]): unknown {
  return purryWithLazy(dropLastImplementation, args, lazyImplementation);
}

const dropLastImplementation = <T extends IterableContainer>(
  array: T,
  n: number,
): T[number][] =>
  n > 0
    ? // Rounded up because a partial item is dropped whole; rounding before
      // subtracting also covers counts too small to change `length - n`.
      array.slice(0, Math.max(0, array.length - Math.ceil(n)))
    : [...array];

function lazyImplementation<T>(n: number): LazyEvaluator<T> {
  if (Number.isNaN(n) || n <= 0) {
    return (item) => item;
  }

  if (n === Infinity) {
    // Nothing is ever passed on, so there's no point holding items back.
    return () => SKIP_ITEM;
  }

  const heldBackCount = Math.ceil(n);
  const heldBack: T[] = [];
  return (item, index) => {
    if (index < heldBackCount) {
      heldBack.push(item);
      return SKIP_ITEM;
    }

    // A ring buffer of the latest items: the current item proves the oldest
    // one isn't among the last `n`, so it's passed on and its slot reused.
    const oldestPosition = index % heldBackCount;
    const oldest = heldBack[oldestPosition]!;
    heldBack[oldestPosition] = item;
    return oldest;
  };
}
