import { purry } from './purry';

type RemovePrefix<
  P extends ReadonlyArray<unknown>,
  T extends ReadonlyArray<unknown>,
> = P extends readonly [...T, ...infer U] ? U : never;

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
  T extends ReadonlyArray<unknown>,
  F extends (...args: any) => any,
>(
  data: [...T],
  func: F
): (...rest: RemovePrefix<Parameters<F>, T>) => ReturnType<F>;

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
): <T extends ReadonlyArray<unknown>>(
  data: [...T]
) => (...rest: RemovePrefix<Parameters<F>, T>) => ReturnType<F>;

export function partialBindTo() {
  return purry(_partialBindTo, arguments);
}

function _partialBindTo<
  A extends ReadonlyArray<unknown>,
  B extends ReadonlyArray<unknown>,
  C,
>(data: A, func: (...args: [...A, ...B]) => C): (...rest: B) => C {
  return (...rest: B) => func(...data, ...rest);
}
