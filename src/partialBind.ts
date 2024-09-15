/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-return --
 * Function inference doesn't work when `unknown` is used as the parameters
 * generic type, it **has** to be `any`.
 */
import type { IterableContainer, RemedaTypeError } from "./internal/types";

type PartialBindError<Message extends string> = [
  RemedaTypeError<"partialBind", Message>,
];

type RemovePrefix<
  T extends IterableContainer,
  Prefix extends IterableContainer,
> = Prefix["length"] extends 0
  ? T
  : T["length"] extends 0
    ? PartialBindError<"Too many args provided to function">
    : T extends [infer THead, ...infer TRest]
      ? Prefix extends [infer PrefixHead, ...infer PrefixRest]
        ? PrefixHead extends THead
          ? RemovePrefix<TRest, PrefixRest>
          : PartialBindError<"Argument of the wrong type provided to function">
        : Prefix extends Array<THead>
          ? [THead?, ...RemovePrefix<TRest, Prefix>]
          : never
      : T extends [(infer THead)?, ...infer TRest]
        ? Prefix extends [infer PrefixHead, ...infer PrefixRest]
          ? PrefixHead extends THead
            ? RemovePrefix<TRest, PrefixRest>
            : PartialBindError<"Argument of the wrong type provided to function">
          : Prefix extends TRest
            ? TRest
            : never
        : never;

type PartiallyBound<
  F extends (...args: any) => any,
  T extends IterableContainer,
> = (...rest: RemovePrefix<Parameters<F>, T>) => ReturnType<F>;

/**
 * Creates a function that calls `func` with `data` put before the arguments
 * it receives.
 *
 * @param data - The arguments to put before.
 * @param func - The function to wrap.
 * @returns A partially bound function.
 * @signature
 *    R.partialBind(data, func)
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialBind([1, 2], fn)
 *    partialFn(3) // => 1, 2, and 3
 * @dataFirst
 * @category Function
 * @see partialRightBind
 */
export function partialBind<
  T extends IterableContainer,
  F extends (...args: any) => any,
>(data: T, func: F): PartiallyBound<F, T> {
  return (...rest) => func(...data, ...rest);
}
