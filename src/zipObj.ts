import { purry } from './purry';

/**
 * Creates a new object from two supplied lists by pairing up equally-positioned items.
 * Key/value pairing is truncated to the length of the shorter of the two lists
 * @param first the first input list
 * @param second the second input list
 * @signature
 *   R.zipObj(first, second)
 * @example
 *   R.zipObj(['a', 'b'], [1, 2]) // => {a: 1, b: 2}
 * @data_first
 * @category Array
 */
export function zipObj<F extends string | number | symbol, S>(
  first: ReadonlyArray<F>,
  second: ReadonlyArray<S>
): Record<F, S>;

/**
 * Creates a new object from two supplied lists by pairing up equally-positioned items.
 * Key/value pairing is truncated to the length of the shorter of the two lists
 * @param second the second input list
 * @signature
 *   R.zipObj(second)(first)
 * @example
 *   R.zipObj([1, 2])(['a', 'b']) // => {a: 1, b: 2}
 * @data_last
 * @category Array
 */
export function zipObj<S>(
  second: ReadonlyArray<S>
): <F extends string | number | symbol>(
  first: ReadonlyArray<F>
) => Record<F, S>;

export function zipObj() {
  return purry(_zipObj, arguments);
}

function _zipObj(
  first: Array<string | number | symbol>,
  second: Array<unknown>
) {
  const resultLength =
    first.length > second.length ? second.length : first.length;
  const result: Record<string | number | symbol, unknown> = {};
  for (let i = 0; i < resultLength; i++) {
    result[first[i]] = second[i];
  }

  return result;
}
