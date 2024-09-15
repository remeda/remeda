/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-return --
 * Function inference doesn't work when `unknown` is used as the parameters
 * generic type, it **has** to be `any`.
 */
import type { IterableContainer, RemedaTypeError } from "./internal/types";

type PartialRightBindError<Message extends string> = [
  RemedaTypeError<"partialRightBind", Message>,
];

type RemoveSuffix<
  T extends IterableContainer,
  Suffix extends IterableContainer,
> = Suffix["length"] extends 0
  ? T
  : T["length"] extends 0
    ? PartialRightBindError<"Too many args provided to function">
    : T extends [...infer TRest, infer TLast]
      ? Suffix extends [...infer SuffixRest, infer SuffixLast]
        ? SuffixLast extends TLast
          ? RemoveSuffix<TRest, SuffixRest>
          : PartialRightBindError<"Argument of the wrong type provided to function">
        : Suffix extends Array<TLast>
          ? [...RemoveSuffix<TRest, Suffix>, TLast?]
          : never
      : T extends [...infer TRest, (infer TLast)?]
        ? Suffix extends [...infer SuffixRest, infer SuffixLast]
          ? SuffixLast extends TLast
            ? RemoveSuffix<TRest, SuffixRest>
            : PartialRightBindError<"Argument of the wrong type provided to function">
          : Suffix extends TRest
            ? TRest
            : never
        : never;

type PartiallyRightBound<
  F extends (...args: any) => any,
  T extends IterableContainer,
> = (...rest: RemoveSuffix<Parameters<F>, T>) => ReturnType<F>;

/**
 * Creates a function that calls `func` with `data` put after the arguments
 * it receives.
 *
 * @param data - The arguments to put after.
 * @param func - The function to wrap.
 * @returns A partially bound function.
 * @signature
 *    R.partialRightBind(data, func)
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialRightBind([2, 3], fn)
 *    partialFn(1) // => 1, 2, and 3
 * @dataFirst
 * @category Function
 * @see partialBind
 */
export function partialRightBind<
  T extends IterableContainer,
  F extends (...args: any) => any,
>(data: T, func: F): PartiallyRightBound<F, T> {
  return (...rest) => func(...rest, ...data);
}
