import { IterableContainer } from './_types';
import { purry } from './purry';

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned items.
 * The length of the returned list will match the shortest of the two inputs.
 *
 * If the input array are non-variadic tuple, you can use the strict option
 * to get another tuple instead of an array type.
 * @param first the first input list
 * @param second the second input list
 * @signature
 *   R.zip(first, second)
 * @example
 *   R.zip([1, 2], ['a', 'b']) // => [[1, 'a'], [2, 'b']] (type: [1 | 2, 'a' | 'b'][])
 *   R.zip.strict([1, 2] as const, ['a', 'b'] as const) // => [[1, 'a'], [2, 'b']]  (type: [[1, 'a'], [2, 'b']])
 * @dataFirst
 * @category Array
 * @strict
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
 *   R.zip(['a', 'b'])([1, 2]) // => [[1, 'a'], [2, 'b']]
 * @dataLast
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

type Strict = <T extends IterableContainer, K extends IterableContainer>(
  first: T,
  second: K
) => StrictOut<T, K>;

type JoinTuples<
  Shorter extends IterableContainer,
  Longer extends IterableContainer,
  ShorterFirst extends 0 | 1
> = {
  -readonly [P in keyof Shorter]: P extends keyof Longer
    ? ShorterFirst extends 1
      ? [Shorter[P], Longer[P]]
      : [Longer[P], Shorter[P]]
    : never;
};

// The first two checks are to ensure that both tuples are finite (checking all
// the edge cases and possible combinations of variadic tuples is nearly impossible),
// while the last check is used to determine which tuple is smaller so that it can be
// used to index the other one
type StrictOut<
  K extends IterableContainer,
  T extends IterableContainer
> = number extends K['length']
  ? number extends T['length']
    ? Array<[K[number], T[number]]>
    : Array<[K[number], T[number]]>
  : keyof K extends keyof T
  ? JoinTuples<K, T, 1>
  : JoinTuples<T, K, 0>;

export namespace zip {
  export const strict: Strict = zip;
}
