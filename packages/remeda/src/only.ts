import { purry1 } from "./internal/purryByArity";
import type { IterableContainer } from "./internal/types/IterableContainer";

type Only<T extends IterableContainer> = T extends
  | readonly [...unknown[], unknown, unknown]
  | readonly []
  | readonly [unknown, ...unknown[], unknown]
  | readonly [unknown, unknown, ...unknown[]]
  ? undefined
  : T extends readonly [unknown]
    ? T[number]
    : T[number] | undefined;

/**
 * Returns the first and only element of `data`, or undefined otherwise.
 *
 * @param data - The target array.
 * @signature
 *    only(data)
 * @example
 *    only([]) // => undefined
 *    only([1]) // => 1
 *    only([1, 2]) // => undefined
 * @dataFirst
 * @category Array
 */
export function only<T extends IterableContainer>(data: T): Only<T>;

/**
 * Returns the first and only element of `data`, or undefined otherwise.
 *
 * @signature
 *    only()(data)
 * @example
 *    pipe([], only()); // => undefined
 *    pipe([1], only()); // => 1
 *    pipe([1, 2], only()); // => undefined
 * @dataLast
 * @category Array
 */
export function only<T extends IterableContainer>(): (data: T) => Only<T>;

export function only(data?: unknown): unknown {
  return purry1(onlyImplementation, arguments.length, data);
}

const onlyImplementation = <T>(data: readonly T[]): T | undefined =>
  data.length === 1 ? data[0] : undefined;
