import { IterableContainer } from './_types';
import { purry } from './purry';

type RemedaTypeError<Message extends string | number> = [
  Message extends string
    ? `RemedaTypeError(partialBindTo): ${Message}.`
    : RemedaTypeError<`[ERR:${Message}] Something unexpected happened! please report this in the remeda github project`>,
];

type RemovePrefix<
  T extends IterableContainer,
  Prefix extends IterableContainer,
> = Prefix['length'] extends 0
  ? T
  : T['length'] extends 0
    ? RemedaTypeError<'Too many args provided to function'>
    : T extends [infer THead, ...infer TRest]
      ? Prefix extends [infer PrefixHead, ...infer PrefixRest]
        ? PrefixHead extends THead
          ? RemovePrefix<TRest, PrefixRest>
          : RemedaTypeError<'Argument of the wrong type provided to function'>
        : RemedaTypeError<1>
      : T extends [(infer THead)?, ...infer TRest]
        ? Prefix extends [infer PrefixHead, ...infer PrefixRest]
          ? PrefixHead extends THead
            ? RemovePrefix<TRest, PrefixRest>
            : RemedaTypeError<'Argument of the wrong type provided to function'>
          : Prefix extends TRest
            ? TRest
            : RemedaTypeError<2>
        : RemedaTypeError<3>;

type PartiallyBound<
  F extends (...args: any) => any,
  T extends IterableContainer,
> = (...rest: RemovePrefix<Parameters<F>, T>) => ReturnType<F>;

/**
 * Creates a function that calls `func` with `data` put before the arguments
 * it receives.
 *
 * @param data the arguments to put before
 * @param func the function to wrap
 * @returns a partially bound function
 *
 * @signature
 *    R.partialBindTo(data, func)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialBindTo([1, 2], fn)
 *    partialFn(3) // => 1, 2, and 3
 *
 * @dataFirst
 * @category Function
 * @see partialRightBindTo
 */
export function partialBindTo<
  T extends IterableContainer,
  F extends (...args: any) => any,
>(data: T, func: F): PartiallyBound<F, T>;

/**
 * Creates a function that calls `func` with `data` put before the arguments
 * it receives.
 *
 * @param func the function to wrap
 * @param data the arguments to put before
 * @returns a partially bound function
 *
 * @signature
 *    R.partialBindTo(func)(data)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialBindTo(fn)([1, 2])
 *    partialFn(3) // => 1, 2, and 3
 *
 * @dataLast
 * @category Function
 * @see partialRightBindTo
 */
export function partialBindTo<F extends (...args: any) => any>(
  func: F
): <T extends IterableContainer>(data: T) => PartiallyBound<F, T>;

export function partialBindTo() {
  return purry(_partialBindTo, arguments);
}

function _partialBindTo<
  T extends IterableContainer,
  F extends (...args: any) => any,
>(
  data: T,
  func: F
): (...rest: RemovePrefix<Parameters<F>, T>) => ReturnType<F> {
  return (...rest) => func(...data, ...rest);
}
