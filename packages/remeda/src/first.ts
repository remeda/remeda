import { makeReducing } from "./internal/makeReducing";
import {
  lastLazyValue,
  makeStoppable,
  type StoppableLazyEvaluator,
} from "./internal/makeStoppable";
import { purryWithLazy1 } from "./internal/purryWithLazyByArity";
import type { First } from "./internal/types/First";
import type { TupleInferringArray } from "./internal/types/TupleInferringArray";

/**
 * Gets the first element of `array`.
 *
 * @param data - The array.
 * @returns The first element of the array.
 * @signature
 *    first(data)
 * @example
 *    first([1, 2, 3]) // => 1
 *    first([]) // => undefined
 * @dataFirst
 * @lazy
 * @category Array
 */
export function first<T extends TupleInferringArray>(data: T): First<T>;

/**
 * Gets the first element of `array`.
 *
 * @returns The first element of the array.
 * @signature
 *    first()(data)
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
export function first(): <T extends TupleInferringArray>(data: T) => First<T>;

export function first(data?: readonly unknown[]): unknown {
  return purryWithLazy1(
    firstImplementation,
    lazyImplementation,
    arguments.length,
    data,
  );
}

const firstImplementation = <T>([item]: readonly T[]): T | undefined => item;

const lazyImplementation = makeReducing(makeStoppable(() => emitAndStop));

const emitAndStop: StoppableLazyEvaluator = (value, _index, _data, slot) =>
  lastLazyValue(value, slot);
