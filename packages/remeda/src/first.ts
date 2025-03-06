import type { IterableElement } from "type-fest";
import doReduce from "./internal/doReduce";
import type { IterableContainer } from "./internal/types/IterableContainer";
import { isArray } from "./isArray";

type First<T extends Iterable<unknown>> = [T] extends [IterableContainer]
  ? T extends []
    ? undefined
    : T extends readonly [unknown, ...Array<unknown>]
      ? T[0]
      : T extends readonly [...infer Pre, infer Last]
        ? Last | Pre[0]
        : T[0] | undefined
  : IterableElement<T> | undefined;

/**
 * Gets the first element of `array`.
 *
 * @param data - The array.
 * @returns The first element of the array.
 * @signature
 *    R.first(array)
 * @example
 *    R.first([1, 2, 3]) // => 1
 *    R.first([]) // => undefined
 * @dataFirst
 * @lazy
 * @category Array
 */
export function first<T extends Iterable<unknown>>(data: T): First<T>;

/**
 * Gets the first element of `array`.
 *
 * @returns The first element of the array.
 * @signature
 *    R.first()(array)
 * @example
 *    R.pipe(
 *      [1, 2, 4, 8, 16],
 *      R.filter(x => x > 3),
 *      R.first(),
 *      x => x + 1
 *    ); // => 5
 * @dataLast
 * @lazy
 * @category Array
 */
export function first(): <T extends Iterable<unknown>>(data: T) => First<T>;

export function first(...args: ReadonlyArray<unknown>): unknown {
  return doReduce(firstImplementation, args);
}

function firstImplementation<T>(data: Iterable<T>): T | undefined {
  if (isArray(data)) {
    return data[0];
  }
  // eslint-disable-next-line no-unreachable-loop
  for (const value of data) {
    return value;
  }
  return undefined;
}
