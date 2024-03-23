import type { IterableContainer } from "./_types";
import { purry } from "./purry";

type Zipped<Left extends IterableContainer, Right extends IterableContainer> =
  // If the array is empty the output is empty, no surprises
  Left extends readonly []
    ? []
    : Right extends readonly []
      ? []
      : // Are the two inputs both tuples with a non-rest first item?
        Left extends readonly [infer LeftHead, ...infer LeftRest]
        ? Right extends readonly [infer RightHead, ...infer RightRest]
          ? // ...Then take that first item from both and recurse
            [[LeftHead, RightHead], ...Zipped<LeftRest, RightRest>]
          : // Is only one of the inputs a tuple (with a non-rest first item)?
            // Then take that item, and match it with whatever the type of the other *array's* items are.
            [[LeftHead, Right[number]], ...Zipped<LeftRest, Right>]
        : Right extends readonly [infer RightHead, ...infer RightRest]
          ? [[Left[number], RightHead], ...Zipped<Left, RightRest>]
          : // Both inputs are not tuples (with a non-rest first item, they might be tuples with non-rest last item(s))
            // So the output is just the "trivial" zip result.
            Array<[Left[number], Right[number]]>;

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned
 * items. The length of the returned list will match the shortest of the two
 * inputs.
 *
 * @param first - The first input list.
 * @param second - The second input list.
 * @signature
 *   R.zip(first, second)
 * @example
 *   R.zip([1, 2], ['a', 'b']) // => [[1, 'a'], [2, 'b']]
 * @dataFirst
 * @category Array
 */
export function zip<F extends IterableContainer, S extends IterableContainer>(
  first: F,
  second: S,
): Zipped<F, S>;

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned
 * items. The length of the returned list will match the shortest of the two
 * inputs.
 *
 * @param second - The second input list.
 * @signature
 *   R.zip(second)(first)
 * @example
 *   R.zip(['a', 'b'])([1, 2]) // => [[1, 'a'], [2, 'b']]
 * @dataLast
 * @category Array
 */
export function zip<S extends IterableContainer>(
  second: S,
): <F extends IterableContainer>(first: F) => Zipped<F, S>;

export function zip(...args: ReadonlyArray<unknown>): unknown {
  return purry(zipImplementation, args);
}

function zipImplementation<
  F extends IterableContainer,
  S extends IterableContainer,
>(first: F, second: S): Zipped<F, S> {
  const resultLength =
    first.length > second.length ? second.length : first.length;

  const result: Array<[F[number], S[number]]> = [];

  for (let i = 0; i < resultLength; i++) {
    result.push([first[i], second[i]]);
  }

  return result as Zipped<F, S>;
}
