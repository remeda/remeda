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
 *    R.partial(func, arg1, arg2, arg3)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partial(fn, 2, 3)
 *    partialFn(1) // => 1, 2, and 3
 *
 * @category Function
 * @see partial
 */
export function partialRight<A extends ReadonlyArray<unknown>, C>(
  func: (...args: [...A]) => C
): (...rest: A) => C;

export function partialRight<A extends ReadonlyArray<unknown>, B1, C>(
  func: (...args: [...A, B1]) => C,
  arg1: B1
): (...rest: A) => C;

export function partialRight<A extends ReadonlyArray<unknown>, B1, B2, C>(
  func: (...args: [...A, B1, B2]) => C,
  arg1: B1,
  arg2: B2
): (...rest: A) => C;

export function partialRight<A extends ReadonlyArray<unknown>, B1, B2, B3, C>(
  func: (...args: [...A, B1, B2, B3]) => C,
  arg1: B1,
  arg2: B2,
  arg3: B3
): (...rest: A) => C;

export function partialRight<
  A extends ReadonlyArray<unknown>,
  B1,
  B2,
  B3,
  B4,
  C,
>(
  func: (...args: [...A, B1, B2, B3, B4]) => C,
  arg1: B1,
  arg2: B2,
  arg3: B3,
  arg4: B4
): (...rest: A) => C;

export function partialRight<
  A extends ReadonlyArray<unknown>,
  B1,
  B2,
  B3,
  B4,
  B5,
  C,
>(
  func: (...args: [...A, B1, B2, B3, B4, B5]) => C,
  arg1: B1,
  arg2: B2,
  arg3: B3,
  arg4: B4,
  arg5: B5
): (...rest: A) => C;

export function partialRight<
  A extends ReadonlyArray<unknown>,
  B1,
  B2,
  B3,
  B4,
  B5,
  B6,
  C,
>(
  func: (...args: [...A, B1, B2, B3, B4, B5, B6]) => C,
  arg1: B1,
  arg2: B2,
  arg3: B3,
  arg4: B4,
  arg5: B5,
  arg6: B6
): (...rest: A) => C;

export function partialRight<
  A extends ReadonlyArray<unknown>,
  B1,
  B2,
  B3,
  B4,
  B5,
  B6,
  B7,
  C,
>(
  func: (...args: [...A, B1, B2, B3, B4, B5, B6, B7]) => C,
  arg1: B1,
  arg2: B2,
  arg3: B3,
  arg4: B4,
  arg5: B5,
  arg6: B6,
  arg7: B7
): (...rest: A) => C;

export function partialRight<
  A extends ReadonlyArray<unknown>,
  B1,
  B2,
  B3,
  B4,
  B5,
  B6,
  B7,
  B8,
  C,
>(
  func: (...args: [...A, B1, B2, B3, B4, B5, B6, B7, B8]) => C,
  arg1: B1,
  arg2: B2,
  arg3: B3,
  arg4: B4,
  arg5: B5,
  arg6: B6,
  arg7: B7,
  arg8: B8
): (...rest: A) => C;

export function partialRight<
  A extends ReadonlyArray<unknown>,
  B1,
  B2,
  B3,
  B4,
  B5,
  B6,
  B7,
  B8,
  B9,
  C,
>(
  func: (...args: [...A, B1, B2, B3, B4, B5, B6, B7, B8, B9]) => C,
  arg1: B1,
  arg2: B2,
  arg3: B3,
  arg4: B4,
  arg5: B5,
  arg6: B6,
  arg7: B7,
  arg8: B8,
  arg9: B9
): (...rest: A) => C;

export function partialRight<
  A extends ReadonlyArray<unknown>,
  B extends ReadonlyArray<unknown>,
  C,
>(func: (...args: [...A, ...B]) => C, ...args: B): (...rest: A) => C {
  return (...rest: A) => func(...rest, ...args);
}
