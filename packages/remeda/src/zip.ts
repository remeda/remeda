import {
  lastLazyValue,
  LAZY_EMPTY_EVALUATOR,
  makeStoppable,
  type StoppableLazyEvaluator,
} from "./internal/makeStoppable";
import { purryWithLazy2 } from "./internal/purryWithLazyByArity";
import type { IterableContainer } from "./internal/types/IterableContainer";

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
            [Left[number], Right[number]][];

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned
 * items. The length of the returned list will match the shortest of the two
 * inputs.
 *
 * @param data - The first input list.
 * @param other - The second input list.
 * @signature
 *   zip(data, other)
 * @example
 *   zip([1, 2], ['a', 'b']) // => [[1, 'a'], [2, 'b']]
 * @dataFirst
 * @lazy
 * @category Array
 */
export function zip<F extends IterableContainer, S extends IterableContainer>(
  data: F,
  other: S,
): Zipped<F, S>;

/**
 * Creates a new list from two supplied lists by pairing up equally-positioned
 * items. The length of the returned list will match the shortest of the two
 * inputs.
 *
 * @param other - The second input list.
 * @signature
 *   zip(other)(data)
 * @example
 *   zip(['a', 'b'])([1, 2]) // => [[1, 'a'], [2, 'b']]
 * @dataLast
 * @lazy
 * @category Array
 */
export function zip<S extends IterableContainer>(
  other: S,
): <F extends IterableContainer>(data: F) => Zipped<F, S>;

export function zip(dataOrOther: unknown, other?: unknown): unknown {
  return purryWithLazy2(
    // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
    zipImplementation,
    lazyImplementation,
    arguments.length,
    dataOrOther,
    other,
  );
}

const zipImplementation = <
  F extends IterableContainer,
  S extends IterableContainer,
>(
  data: F,
  other: S,
): Zipped<F, S> =>
  (data.length < other.length
    ? data.map((item, index) => [item, other[index]])
    : other.map((item, index) => [data[index], item])) as Zipped<F, S>;

const lazyImplementation = makeStoppable(
  <F extends IterableContainer, S extends IterableContainer>(
    other: S,
  ): StoppableLazyEvaluator<F[number], [F[number], S[number]]> =>
    other.length === 0
      ? LAZY_EMPTY_EVALUATOR
      : (value, index, _data, slot) => {
          const pair: [F[number], S[number]] = [value, other[index]];
          return index >= other.length - 1 ? lastLazyValue(pair, slot) : pair;
        },
);
