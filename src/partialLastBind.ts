/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-return --
 * Function inference doesn't work when `unknown` is used as the parameters
 * generic type, it **has** to be `any`.
 */
import type { IterableContainer, RemedaTypeError } from "./internal/types";

type PartialLastBindError<Message extends string | number> = [
  RemedaTypeError<"partialLastBind", Message>,
];

type RemoveSuffix<
  T extends IterableContainer,
  Suffix extends IterableContainer,
> = Suffix["length"] extends 0
  ? T
  : T["length"] extends 0
    ? PartialLastBindError<"Too many args provided to function">
    : T extends readonly [...infer TRest, infer TLast]
      ? Suffix extends readonly [...infer SuffixRest, infer SuffixLast]
        ? // Both T and Suffix have a non-rest last.
          SuffixLast extends TLast
          ? RemoveSuffix<TRest, SuffixRest>
          : PartialLastBindError<"Given type does not match positional argument">
        : Suffix extends ReadonlyArray<TLast>
          ? // T has a non-rest last, Suffix is an array.
            // Suffix could possibly be empty, so this has to be TLast?.
            [...RemoveSuffix<TRest, Suffix>, TLast?]
          : // Suffix is e.g. [string, ...Array<number>]. We can't do a
            // type-level suffix removal, so we return an error.
            PartialLastBindError<"Can't construct signature from provided args">
      : // T has an optional or rest parameter last. If T is a parameter list,
        // this can only happen if we have optional arguments or a rest param;
        // both cases are similar.
        T extends readonly [...infer TRest, (infer TLast)?]
        ? Suffix extends readonly [...infer SuffixRest, infer SuffixLast]
          ? // Suffix has a non-rest last.
            SuffixLast extends TLast
            ? RemoveSuffix<TRest, SuffixRest>
            : PartialLastBindError<"Given type does not match optional or rest argument">
          : Suffix extends readonly [...TRest, TLast?]
            ? // Suffix is an array. It must match *both* the optional type
              // and the rest param.
              TRest
            : PartialLastBindError<"Given type does not match optional and rest argument">
        : // We got passed a parameter list that isn't what we expected; this
          // is an internal error.
          PartialLastBindError<1>;

type PartiallyLastBound<
  F extends (...args: any) => any,
  SuffixArgs extends IterableContainer,
> = (...rest: RemoveSuffix<Parameters<F>, SuffixArgs>) => ReturnType<F>;

/**
 * Creates a function that calls `func` with `partial` put after the arguments
 * it receives.
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
  SuffixArgs extends IterableContainer,
>(func: F, partial: SuffixArgs): PartiallyLastBound<F, SuffixArgs> {
  return (...rest) => func(...rest, ...partial);
}
