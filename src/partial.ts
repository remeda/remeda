/**
 * Creates a function that calls `func` with `args` put before the arguments it
 * receives.
 *
 * **Note:** This method doesn't set the `length` property of partially applied
 * functions.
 *
 * @param func the function to wrap
 * @param args the arguments to put before
 * @returns a partially applied function
 *
 * @signature
 *    R.partial(func, arg1, arg2, arg3)
 *
 * @example
 *    const fn = (x, y, z) => `${x}, ${y}, and ${z}`
 *    const partialFn = R.partial(fn, 1, 2)
 *    partialFn(3) // => 1, 2, and 3
 *
 * @category Function
 * @see partialRight
 */
export function partial<A extends Array<unknown>, B extends Array<unknown>, C>(
  func: (...args: [...A, ...B]) => C,
  ...args: A
): (...rest: B) => C {
  return (...rest: B) => func(...args, ...rest);
}
