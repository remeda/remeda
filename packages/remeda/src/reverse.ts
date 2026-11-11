import { purry1 } from "./internal/purryByArity";

type Reverse<
  T extends readonly unknown[],
  R extends readonly unknown[] = [],
> = ReturnType<
  T extends IsNoTuple<T>
    ? () => [...T, ...R]
    : T extends readonly [infer F, ...infer L]
      ? () => Reverse<L, [F, ...R]>
      : () => R
>;

type IsNoTuple<T> = T extends readonly [unknown, ...unknown[]] ? never : T;

/**
 * Reverses array.
 *
 * @param data - The array.
 * @signature
 *    reverse(data);
 * @example
 *    reverse([1, 2, 3]); // [3, 2, 1]
 * @dataFirst
 * @category Array
 */
export function reverse<T extends readonly unknown[]>(data: T): Reverse<T>;

/**
 * Reverses array.
 *
 * @signature
 *    reverse()(data);
 * @example
 *    reverse()([1, 2, 3]); // [3, 2, 1]
 * @dataLast
 * @category Array
 */
export function reverse<T extends readonly unknown[]>(): (
  data: T,
) => Reverse<T>;

export function reverse(data?: unknown): unknown {
  return purry1(reverseImplementation, arguments.length, data);
}

const reverseImplementation = <T>(data: readonly T[]): T[] =>
  // eslint-disable-next-line unicorn/no-array-reverse -- `reverse` only mutates our own copy here, and `toReversed` is slower on larger arrays.
  data.concat().reverse();
