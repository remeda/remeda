/**
 * Generates a sequence of values by calling a function repeatedly.
 *
 * @param fn - The function to generate values.  The argument is the number of times the function has been called.
 * @signature
 *    R.generate(fn);
 * @example
 *    R.pipe(R.generate(0, (i) => i**2), R.take(4)) // => [0, 1, 4, 9]
 * @lazy
 * @category Iterable
 * @yields The value returned by `fn`.
 */
export function* generate<R>(fn: (i: number) => R): Iterable<R> {
  let i = 0;
  for (;;) {
    yield fn(i++);
  }
}
