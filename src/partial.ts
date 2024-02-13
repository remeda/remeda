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
 * @returns a partially applied function
 *
 * @signature
 *    R.partial(data, func)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partial([1, 2], fn)
 *    partialFn(3) // => 1, 2, and 3
 *
 * @dataFirst
 * @category Function
 * @see partialRight
 */
export function partial<
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
 * @returns a partially applied function
 *
 * @signature
 *    R.partial(func)(data)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partial(fn)([1, 2])
 *    partialFn(3) // => 1, 2, and 3
 *
 * @dataLast
 * @category Function
 * @see partialRight
 */
export function partial<F extends (...args: any) => any>(
  func: F
): <T extends ReadonlyArray<unknown>>(
  data: [...T]
) => (...rest: RemovePrefix<Parameters<F>, T>) => ReturnType<F>;

export function partial() {
  return purry(_partial, arguments);
}

function _partial<
  A extends ReadonlyArray<unknown>,
  B extends ReadonlyArray<unknown>,
  C,
>(data: A, func: (...args: [...A, ...B]) => C): (...rest: B) => C {
  return (...rest: B) => func(...data, ...rest);
}
