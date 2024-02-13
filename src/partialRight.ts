import { purry } from './purry';

type RemoveSuffix<
  P extends ReadonlyArray<unknown>,
  U extends ReadonlyArray<unknown>,
> = P extends readonly [...infer T, ...U] ? T : never;

/**
 * Creates a function that calls `func` with `data` put after the arguments it
 * receives.
 *
 * @param data the arguments to put after
 * @param func the function to wrap
 * @returns a partially applied function
 *
 * @signature
 *    R.partialRight(data, func)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialRight([2, 3], fn)
 *    partialFn(1) // => 1, 2, and 3
 *
 * @dataFirst
 * @category Function
 * @see partial
 */
export function partialRight<
  T extends ReadonlyArray<unknown>,
  F extends (...args: any) => any,
>(
  data: [...T],
  func: F
): (...rest: RemoveSuffix<Parameters<F>, T>) => ReturnType<F>;

/**
 * Creates a function that calls `func` with `data` put after the arguments it
 * receives.
 *
 * @param func the function to wrap
 * @param data the arguments to put after
 * @returns a partially applied function
 *
 * @signature
 *    R.partialRight(func)(data)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partialRight(fn)([2, 3])
 *    partialFn(1) // => 1, 2, and 3
 *
 * @dataLast
 * @category Function
 * @see partial
 */
export function partialRight<F extends (...args: any) => any>(
  func: F
): <T extends ReadonlyArray<unknown>>(
  data: [...T]
) => (...rest: RemoveSuffix<Parameters<F>, T>) => ReturnType<F>;

export function partialRight() {
  return purry(_partialRight, arguments);
}

function _partialRight<
  A extends ReadonlyArray<unknown>,
  B extends ReadonlyArray<unknown>,
  C,
>(data: B, func: (...args: [...A, ...B]) => C): (...rest: A) => C {
  return (...rest: A) => func(...rest, ...data);
}
