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
) => Zip<T, K>;

type Zip<Left extends IterableContainer, Right extends IterableContainer> =
  // If the array is empty the output is empty, no surprises
  Left extends readonly []
    ? []
    : Right extends readonly []
    ? []
    : // Are the two inputs both tuples with a non-rest first item?
    Left extends readonly [infer LeftHead, ...infer LeftRest]
    ? Right extends readonly [infer RightHead, ...infer RightRest]
      ? // ...Then take that first item from both and recurse
        [[LeftHead, RightHead], ...Zip<LeftRest, RightRest>]
      : // Is only one of the inputs a tuple (with a non-rest first item)?
        // Then take that item, and match it with whatever the type of the other *array's* items are.
        [[LeftHead, Right[number]], ...Zip<LeftRest, Right>]
    : Right extends readonly [infer RightHead, ...infer RightRest]
    ? [[Left[number], RightHead], ...Zip<Left, RightRest>]
    : // Both inputs are not tuples (with a non-rest first item, they might be tuples with non-rest last item(s))
      // So the output is just the "trivial" zip result.
      Array<[Left[number], Right[number]]>;

export namespace zip {
  export const strict: Strict = zip;
}
