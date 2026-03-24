import { toSingle } from "./internal/toSingle";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { purry } from "./purry";

type First<T extends IterableContainer> = T extends []
  ? undefined
  : T extends readonly [unknown, ...unknown[]]
    ? T[0]
    : T extends readonly [...infer Pre, infer Last]
      ? Last | Pre[0]
      : T[0] | undefined;

/**
 * Gets the first element of `array`.
 *
 * @param data - The array.
 * @returns The first element of the array.
 * @signature
 *    first(array)
 * @example
 *    first([1, 2, 3]) // => 1
 *    first([]) // => undefined
 * @dataFirst
 * @lazy
 * @category Array
 */
export function first<T extends IterableContainer>(data: T): First<T>;

/**
 * Gets the first element of `array`.
 *
 * @returns The first element of the array.
 * @signature
 *    first()(array)
 * @example
 *    pipe(
 *      [1, 2, 4, 8, 16],
 *      filter(x => x > 3),
 *      first(),
 *      x => x + 1
 *    ); // => 5
 * @dataLast
 * @lazy
 * @category Array
 */
export function first(): <T extends IterableContainer>(data: T) => First<T>;

export function first(...args: readonly unknown[]): unknown {
  return purry(firstImplementation, args, toSingle(lazyImplementation));
}

const firstImplementation = <T>([item]: readonly T[]): T | undefined => item;

const lazyImplementation = (): LazyEvaluator => firstLazy;

const firstLazy = <T>(value: T) =>
  ({ hasNext: true, next: value, done: true }) as const;
