import { purry } from './purry';

type Prepend<Tuple extends readonly unknown[], Added> = ((
  _: Added,
  ..._1: Tuple
) => unknown) extends (..._: infer Result) => unknown
  ? Result
  : never;

type Reverse<
  Tuple extends readonly unknown[],
  Prefix extends readonly unknown[] = []
> = {
  0: Prefix;
  1: ((..._: Tuple) => unknown) extends (
    _: infer First,
    ..._1: infer Next
  ) => unknown
    ? Reverse<Next, Prepend<Prefix, First>>
    : never;
}[Tuple extends readonly [unknown, ...unknown[]] ? 1 : 0];

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
): T extends IsTuple<T> ? Reverse<T> : T;

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
) => T extends IsTuple<T> ? Reverse<T> : T;

export function reverse() {
  return purry(_reverse, arguments);
}

function _reverse(array: any[]) {
  return array.slice().reverse();
}
