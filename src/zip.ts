import { purry } from './purry';

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned items.
 * The length of the returned list will match the shortest of the two inputs.
 * @param first the first input list
 * @param second the second input list
 * @signature
 *   R.zip(first, second)
 * @example
 *   R.zip([1, 2], ['a', 'b']) // => [1, 'a'], [2, 'b']
 * @data_first
 * @category Array
 */
export function zip<F, S>(
  first: ReadonlyArray<F>,
  second: ReadonlyArray<S>
): Array<[F, S]>;

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned items.
 * The length of the returned list will match the shortest of the two inputs.
 * @param second the second input list
 * @signature
 *   R.zip(second)(first)
 * @example
 *   R.zip(['a', 'b'])([1, 2]) // => [[1, 'a'], [2, 'b']
 * @data_last
 * @category Array
 */
export function zip<S>(
  second: ReadonlyArray<S>
): <F>(first: ReadonlyArray<F>) => Array<[F, S]>;

export function zip() {
  return purry(_zip, arguments);
}

function _zip(first: Array<unknown>, second: Array<unknown>) {
  const resultLength =
    first.length > second.length ? second.length : first.length;
  const result = [];
  for (let i = 0; i < resultLength; i++) {
    result.push([first[i], second[i]]);
  }

  return result;
}
