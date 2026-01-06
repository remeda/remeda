import { purry } from "./purry";

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
 * @param array - The array.
 * @signature
 *    R.reverse(arr);
 * @example
 *    R.reverse([1, 2, 3]) // [3, 2, 1]
 * @dataFirst
 * @category Array
 */
export function reverse<T extends readonly unknown[]>(array: T): Reverse<T>;

/**
 * Reverses array.
 *
 * @signature
 *    R.reverse()(array);
 * @example
 *    R.reverse()([1, 2, 3]) // [3, 2, 1]
 * @dataLast
 * @category Array
 */
export function reverse<T extends readonly unknown[]>(): (
  array: T,
) => Reverse<T>;

export function reverse(...args: readonly unknown[]): unknown {
  return purry(reverseImplementation, args);
}

function reverseImplementation<T>(array: readonly T[]): T[] {
  // TODO [>2]: When node 18 reaches end-of-life bump target lib to ES2023+ and use `Array.prototype.toReversed` here.
  // eslint-disable-next-line unicorn/no-array-reverse -- See TODO above.
  return [...array].reverse();
}
