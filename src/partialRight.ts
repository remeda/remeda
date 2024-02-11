import { purry } from './purry';

type RemoveSuffix<
  T extends ReadonlyArray<unknown>,
  V extends ReadonlyArray<unknown>,
> = T extends [...infer U, ...V] ? U : never;

/**
 * Creates a function that calls `func` with `args` put after the arguments it
 * receives.
 *
 * **Note:** This method doesn't set the `length` property of partially applied
 * functions.
 *
 * @param func the function to wrap
 * @param args the arguments to put after
 * @returns a partially applied function
 *
 * @signature
 *    R.partialRight(args, func)
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
  A extends ReadonlyArray<unknown>,
  B extends ReadonlyArray<unknown>,
  C,
>(args: [...A], func: (...args: B) => C): (...rest: RemoveSuffix<B, A>) => C;

/**
 * Creates a function that calls `func` with `args` put after the arguments it
 * receives.
 *
 * **Note:** This method doesn't set the `length` property of partially applied
 * functions.
 *
 * @param func the function to wrap
 * @param args the arguments to put after
 * @returns a partially applied function
 *
 * @signature
 *    R.partialRight(func)(args)
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
export function partialRight<B extends ReadonlyArray<unknown>, C>(
  func: (...args: B) => C
): <A extends ReadonlyArray<unknown>>(
  args: [...A]
) => (...rest: RemoveSuffix<B, A>) => C;

export function partialRight() {
  return purry(_partialRight, arguments);
}

function _partialRight<
  A extends ReadonlyArray<unknown>,
  B extends ReadonlyArray<unknown>,
  C,
>(args: B, func: (...args: [...A, ...B]) => C): (...rest: A) => C {
  return (...rest: A) => func(...rest, ...args);
}
