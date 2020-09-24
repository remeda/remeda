import { purry } from './purry';

// prettier-ignore
type ReverseTuple<T extends readonly unknown[], R extends readonly unknown[] = []> = ReturnType<
  T extends readonly [infer F, ...infer L] ? () => ReverseTuple<L, [F, ...R]> : () => R
>;

type IsTuple<T> = T extends readonly [unknown, ...unknown[]] ? T : never;

/**
 * Reverses array.
 * @param array the array
 * @signature
 *    R.reverse(arr);
 * @example
 *    R.reverse([1, 2, 3]) // [3, 2, 1]
 * @data_first
 * @category Array
 */
export function reverse<T extends readonly unknown[]>(
  array: T
): T extends IsTuple<T> ? ReverseTuple<T> : T;

/**
 * Reverses array.
 * @param array the array
 * @signature
 *    R.reverse()(array);
 * @example
 *    R.reverse()([1, 2, 3]) // [3, 2, 1]
 * @data_last
 * @category Array
 */
export function reverse<T extends readonly unknown[]>(): (
  array: T
) => T extends IsTuple<T> ? ReverseTuple<T> : T;

export function reverse() {
  return purry(_reverse, arguments);
}

function _reverse(array: any[]) {
  return array.slice().reverse();
}
