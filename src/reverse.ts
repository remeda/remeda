import { purry } from './purry';

export type Prepend<Tuple extends readonly any[], Added> = ((
  _: Added,
  ..._1: Tuple
) => any) extends (..._: infer Result) => any
  ? Result
  : never;

export type Reverse<
  Tuple extends readonly any[],
  Prefix extends readonly any[] = []
> = {
  0: Prefix;
  1: ((..._: Tuple) => any) extends (_: infer First, ..._1: infer Next) => any
    ? Reverse<Next, Prepend<Prefix, First>>
    : never;
}[Tuple extends readonly [any, ...any[]] ? 1 : 0];

type IsTuple<T> = T extends readonly [any, ...any[]] ? T : never;

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
export function reverse<T extends readonly any[]>(
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
export function reverse<T extends readonly any[]>(): (
  array: T
) => T extends IsTuple<T> ? Reverse<T> : T;

export function reverse() {
  return purry(_reverse, arguments);
}

function _reverse(array: any[]) {
  return array.slice().reverse();
}
