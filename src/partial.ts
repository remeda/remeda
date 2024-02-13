import { purry } from './purry';

type RemovePrefix<
  T extends ReadonlyArray<unknown>,
  U extends ReadonlyArray<unknown>,
> = T extends readonly [...U, ...infer V] ? V : never;

/**
 * Creates a function that calls `func` with `args` put before the arguments
 * it receives.
 *
 * @param args the arguments to put before
 * @param func the function to wrap
 * @returns a partially applied function
 *
 * @signature
 *    R.partial(args, func)
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
  A extends ReadonlyArray<unknown>,
  B extends ReadonlyArray<unknown>,
  C,
>(args: [...A], func: (...args: B) => C): (...rest: RemovePrefix<B, A>) => C;

/**
 * Creates a function that calls `func` with `args` put before the arguments
 * it receives.
 *
 * **Note:** This method doesn't set the `length` property of partially applied
 * functions.
 *
 * @param func the function to wrap
 * @param args the arguments to put before
 * @returns a partially applied function
 *
 * @signature
 *    R.partial(func)(args)
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
export function partial<B extends ReadonlyArray<unknown>, C>(
  func: (...args: B) => C
): <A extends ReadonlyArray<unknown>>(
  args: [...A]
) => (...rest: RemovePrefix<B, A>) => C;

export function partial() {
  return purry(_partial, arguments);
}

function _partial<
  A extends ReadonlyArray<unknown>,
  B extends ReadonlyArray<unknown>,
  C,
>(args: A, func: (...args: [...A, ...B]) => C): (...rest: B) => C {
  return (...rest: B) => func(...args, ...rest);
}
