/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-return --
 * Function inference doesn't work when `unknown` is used as the parameters
 * generic type, it **has** to be `any`.
 */
import type { IterableContainer, RemedaTypeError } from "./internal/types";

type PartialBindError<Message extends string | number> = [
  RemedaTypeError<"partialBind", Message>,
];

type RemovePrefix<
  T extends IterableContainer,
  Prefix extends IterableContainer,
> = Prefix["length"] extends 0
  ? T
  : T["length"] extends 0
    ? PartialBindError<"Too many args provided to function">
    : T extends readonly [infer THead, ...infer TRest]
      ? Prefix extends readonly [infer PrefixHead, ...infer PrefixRest]
        ? // Both T and Prefix have a non-rest head.
          PrefixHead extends THead
          ? RemovePrefix<TRest, PrefixRest>
          : PartialBindError<"Argument of the wrong type provided to function">
        : Prefix extends ReadonlyArray<THead>
          ? // T has a non-rest head, Prefix is an array.
            // Prefix could possibly be empty, so this has to be THead?.
            [THead?, ...RemovePrefix<TRest, Prefix>]
          : // Prefix is e.g. [...Array<number>, string]. We can't do a
            // type-level prefix removal, so we return an error.
            PartialBindError<"Can't infer type of provided args">
      : // T has an optional or rest parameter head. If T is a parameter list,
        // this can only happen if we have optional arguments or a rest param;
        // both cases are similar.
        T extends readonly [(infer THead)?, ...infer TRest]
        ? Prefix extends readonly [infer PrefixHead, ...infer PrefixRest]
          ? // Prefix has a non-rest head.
            PrefixHead extends THead
            ? RemovePrefix<TRest, PrefixRest>
            : PartialBindError<"Argument of the wrong type provided to function">
          : Prefix extends readonly [THead?, ...TRest]
            ? // Prefix is an array. It must match *both* the optional type
              // and the rest param.
              TRest
            : PartialBindError<"Argument of the wrong type provided to function">
        : // We got passed a parameter list that isn't what we expected; this
          // is an internal error.
          PartialBindError<1>;

type PartiallyBound<
  F extends (...args: any) => any,
  Partial extends IterableContainer,
> = (...rest: RemovePrefix<Parameters<F>, Partial>) => ReturnType<F>;

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
 * @see partialRightBind
 */
export function partialBind<
  F extends (...args: any) => any,
  T extends IterableContainer,
>(func: F, partial: T): PartiallyBound<F, T> {
  return (...rest) => func(...partial, ...rest);
}
