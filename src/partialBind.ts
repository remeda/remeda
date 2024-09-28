/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-return --
 * Function inference doesn't work when `unknown` is used as the parameters
 * generic type, it **has** to be `any`.
 */
import type {
  IterableContainer,
  RemedaTypeError,
  TupleSplits,
} from "./internal/types";

type PartialBindError<Message extends string | number> = [
  RemedaTypeError<"partialBind", Message>,
];

type TuplePrefix<T extends IterableContainer> = TupleSplits<T>["left"];

type RemovePrefix<
  T extends IterableContainer,
  Prefix extends TuplePrefix<T>,
> = Prefix["length"] extends 0
  ? T
  : T extends readonly [infer THead, ...infer TRest]
    ? Prefix extends readonly [infer _PrefixHead, ...infer PrefixRest]
      ? // PrefixHead extends THead.
        RemovePrefix<TRest, PrefixRest>
      : // Prefix (as a whole) extends ReadonlyArray<THead>.
        // Prefix could possibly be empty, so this has to be THead?.
        [THead?, ...RemovePrefix<TRest, Prefix>]
    : // T has an optional or rest parameter last. If T is a parameter list,
      // this can only happen if we have optional arguments or a rest param;
      // both cases are similar.
      T extends readonly [(infer _THead)?, ...infer TRest]
      ? Prefix extends readonly [infer _PrefixHead, ...infer PrefixRest]
        ? // PrefixHead extends THead.
          RemovePrefix<TRest, PrefixRest>
        : // Prefix (as a whole) extends [THead?, ...TRest].
          TRest
      : // We got passed a parameter list that isn't what we expected; this is
        // an internal error.
        PartialBindError<1>;

type PartiallyBound<
  F extends (...args: any) => any,
  PrefixArgs extends TuplePrefix<Parameters<F>>,
> = (...rest: RemovePrefix<Parameters<F>, PrefixArgs>) => ReturnType<F>;

/**
 * Creates a function that calls `func` with `partial` put before the arguments
 * it receives.
 *
 * @param func - The function to wrap.
 * @param partial - The arguments to put before.
 * @returns A partially bound function.
 * @signature
 *    R.partialBind(func, partial)
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialBind(fn, [1, 2])
 *    partialFn(3) // => 1, 2, and 3
 * @dataFirst
 * @category Function
 * @see partialLastBind
 */
export function partialBind<
  F extends (...args: any) => any,
  PrefixArgs extends TuplePrefix<Parameters<F>>,
>(func: F, ...partial: PrefixArgs): PartiallyBound<F, PrefixArgs> {
  return (...rest) => func(...partial, ...rest);
}
