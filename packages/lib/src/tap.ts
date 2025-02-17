import { purry } from "./purry";

/**
 * Calls the given function with the given value, then returns the given value.
 * The return value of the provided function is ignored.
 *
 * This allows "tapping into" a function sequence in a pipe, to perform side
 * effects on intermediate results.
 *
 * @param value - The value to pass into the function.
 * @param fn - The function to call.
 * @signature
 *    R.tap(value, fn)
 * @example
 *    R.tap("foo", console.log) // => "foo"
 * @dataFirst
 * @category Other
 */
export function tap<T>(value: T, fn: (value: T) => void): T;

/**
 * Calls the given function with the given value, then returns the given value.
 * The return value of the provided function is ignored.
 *
 * This allows "tapping into" a function sequence in a pipe, to perform side
 * effects on intermediate results.
 *
 * @param fn - The function to call.
 * @signature
 *    R.tap(fn)(value)
 * @example
 *    R.pipe(
 *      [-5, -1, 2, 3],
 *      R.filter(n => n > 0),
 *      R.tap(console.log), // prints [2, 3]
 *      R.map(n => n * 2)
 *    ) // => [4, 6]
 * @dataLast
 * @category Other
 */
export function tap<
  T,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- TODO: This is solvable by inlining F and wrapping the T parameter with `NoInfer` (e.g. `(value: NoInfer<T>) => unknown`); to prevent typescript from inferring it as `unknown`. This is only available in TS 5.4, which is above what we currently support (5.1).
  F extends (value: T) => unknown,
>(fn: F): (value: T) => T;

export function tap(...args: ReadonlyArray<unknown>): unknown {
  return purry(tapImplementation, args);
}

function tapImplementation<T>(value: T, fn: (value: T) => void): T {
  fn(value);
  return value;
}
