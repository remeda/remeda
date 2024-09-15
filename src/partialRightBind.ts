/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-return --
 * Function inference doesn't work when `unknown` is used as the parameters
 * generic type, it **has** to be `any`.
 */
import type { IterableContainer, RemedaTypeError } from "./internal/types";

type PartialRightBindError<Message extends string | number> = [
  RemedaTypeError<"partialRightBind", Message>,
];

type RemoveSuffix<
  T extends IterableContainer,
  Suffix extends IterableContainer,
> = Suffix["length"] extends 0
  ? T
  : T["length"] extends 0
    ? PartialRightBindError<"Too many args provided to function">
    : T extends readonly [...infer TRest, infer TLast]
      ? Suffix extends readonly [...infer SuffixRest, infer SuffixLast]
        ? // Both T and Suffix have a non-rest last.
          SuffixLast extends TLast
          ? RemoveSuffix<TRest, SuffixRest>
          : PartialRightBindError<"Argument of the wrong type provided to function">
        : Suffix extends ReadonlyArray<TLast>
          ? // T has a non-rest last, Suffix is an array.
            // Suffix could possibly be empty, so this has to be TLast?.
            [...RemoveSuffix<TRest, Suffix>, TLast?]
          : // Suffix is e.g. [string, ...Array<number>]. We can't do a
            // type-level suffix removal, so we return an error.
            PartialRightBindError<"Can't infer type of provided args">
      : // T has an optional or rest parameter last. If T is a parameter list,
        // this can only happen if we have optional arguments or a rest param;
        // both cases are similar.
        T extends readonly [...infer TRest, (infer TLast)?]
        ? Suffix extends readonly [...infer SuffixRest, infer SuffixLast]
          ? // Suffix has a non-rest last.
            SuffixLast extends TLast
            ? RemoveSuffix<TRest, SuffixRest>
            : PartialRightBindError<"Argument of the wrong type provided to function">
          : Suffix extends readonly [...TRest, TLast?]
            ? // Suffix is an array. It must match *both* the optional type
              // and the rest param.
              TRest
            : PartialRightBindError<"Argument of the wrong type provided to function">
        : // We got passed a parameter list that isn't what we expected; this
          // is an internal error.
          PartialRightBindError<1>;

type PartiallyRightBound<
  F extends (...args: any) => any,
  Partial extends IterableContainer,
> = (...rest: RemoveSuffix<Parameters<F>, Partial>) => ReturnType<F>;

/**
 * Creates a function that calls `func` with `partial` put after the arguments
 * it receives.
 *
 * @param func - The function to wrap.
 * @param partial - The arguments to put after.
 * @returns A partially bound function.
 * @signature
 *    R.partialRightBind(func, partial)
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialRightBind(fn, [2, 3])
 *    partialFn(1) // => 1, 2, and 3
 * @dataFirst
 * @category Function
 * @see partialBind
 */
export function partialRightBind<
  F extends (...args: any) => any,
  T extends IterableContainer,
>(func: F, partial: T): PartiallyRightBound<F, T> {
  return (...rest) => func(...rest, ...partial);
}
