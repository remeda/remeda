import { purry } from './purry';

type Reverse<
  T extends readonly unknown[],
  R extends readonly unknown[] = []
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
 * @param array the array
 * @signature
 *    R.reverse(arr);
 * @example
 *    R.reverse([1, 2, 3]) // [3, 2, 1]
 * @data_first
 * @category Array
 */
export function reverse<T extends readonly unknown[]>(array: T): Reverse<T>;

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
) => Reverse<T>;

export function reverse() {
  return purry(_reverse, arguments);
}

function _reverse(array: any[]) {
  return array.slice().reverse();
}
