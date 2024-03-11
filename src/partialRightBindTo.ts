import { IterableContainer } from './_types';
import { purry } from './purry';

type RemoveSuffix<
  T extends IterableContainer,
  Suffix extends IterableContainer,
> = T extends readonly [...infer Rest, ...Suffix]
  ? Rest
  : [
      "RemedaTypeError(partialRightBindTo): Data doesn't match function signature.",
    ];

/**
 * Creates a function that calls `func` with `data` put after the arguments it
 * receives.
 *
 * @param data the arguments to put after
 * @param func the function to wrap
 * @returns a partially bound function
 *
 * @signature
 *    R.partialRightBindTo(data, func)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialRightBindTo([2, 3], fn)
 *    partialFn(1) // => 1, 2, and 3
 *
 * @dataFirst
 * @category Function
 * @see partialBindTo
 */
export function partialRightBindTo<
  T extends IterableContainer,
  F extends (...args: any) => any,
>(data: T, func: F): (...rest: RemoveSuffix<Parameters<F>, T>) => ReturnType<F>;

/**
 * Creates a function that calls `func` with `data` put after the arguments it
 * receives.
 *
 * @param func the function to wrap
 * @param data the arguments to put after
 * @returns a partially bound function
 *
 * @signature
 *    R.partialRightBindTo(func)(data)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialRightBindTo(fn)([2, 3])
 *    partialFn(1) // => 1, 2, and 3
 *
 * @dataLast
 * @category Function
 * @see partialBindTo
 */
export function partialRightBindTo<F extends (...args: any) => any>(
  func: F
): <T extends IterableContainer>(
  data: T
) => (...rest: RemoveSuffix<Parameters<F>, T>) => ReturnType<F>;

export function partialRightBindTo() {
  return purry(_partialRightBindTo, arguments);
}

function _partialRightBindTo<
  T extends IterableContainer,
  F extends (...args: any) => any,
>(
  data: T,
  func: F
): (...rest: RemoveSuffix<Parameters<F>, T>) => ReturnType<F> {
  return (...rest) => func(...rest, ...data);
}
