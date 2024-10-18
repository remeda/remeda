/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return --
 * Function inference doesn't work when `unknown` is used as the parameters
 * generic type, it **has** to be `any`.
 */
import type {
  IterableContainer,
  RemedaTypeError,
  TupleSplits,
} from "./internal/types";

type PartialLastBindError<Message extends string | number> = RemedaTypeError<
  "partialLastBind",
  Message
>;

type TupleSuffix<T extends IterableContainer> = TupleSplits<T>["right"];

type RemoveSuffix<
  T extends IterableContainer,
  Suffix extends TupleSuffix<T>,
> = Suffix extends readonly []
  ? T
  : T extends readonly [...infer TRest, infer TLast]
    ? Suffix extends readonly [...infer SuffixRest, infer _SuffixLast]
      ? // SuffixLast extends TLast.
        RemoveSuffix<TRest, SuffixRest>
      : // Suffix (as a whole) extends ReadonlyArray<TLast>.
        // Suffix could possibly be empty, so this has to be TLast?.
        [...RemoveSuffix<TRest, Suffix>, TLast?]
    : // T has an optional or rest parameter last. If T is a parameter list,
      // this can only happen if we have optional arguments or a rest param;
      // both cases are similar.
      T extends readonly [...infer TRest, (infer _TLast)?]
      ? Suffix extends readonly [...infer SuffixRest, infer _SuffixLast]
        ? // SuffixLast extends TLast.
          RemoveSuffix<TRest, SuffixRest>
        : // Suffix (as a whole) extends [...TRest, TLast?].
          TRest
      : // We got passed a parameter list that isn't what we expected; this
        // is an internal error.
        PartialLastBindError<1>;

/**
 * Creates a function that calls `func` with `partial` put after the arguments
 * it receives.
 *
 * Note this doesn't support functions with both optional and rest parameters.
 *
 * @param func - The function to wrap.
 * @param partial - The arguments to put after.
 * @returns A partially bound function.
 * @signature
 *    R.partialLastBind(func, partial)
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialLastBind(fn, [2, 3])
 *    partialFn(1) // => 1, 2, and 3
 * @dataFirst
 * @category Function
 * @see partialBind
 */
export function partialLastBind<
  F extends (...args: any) => any,
  SuffixArgs extends TupleSuffix<Parameters<F>>,
  RemovedSuffix extends RemoveSuffix<Parameters<F>, SuffixArgs>,
>(
  func: F,
  ...partial: SuffixArgs
): (
  ...rest: RemovedSuffix extends IterableContainer ? RemovedSuffix : never
) => ReturnType<F> {
  return (...rest) => func(...rest, ...partial);
}
