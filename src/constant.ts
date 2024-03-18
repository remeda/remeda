/**
 * A function that takes any arguments and returns the provided `value` on every
 * invocation. This is useful to provide trivial implementations for APIs or in
 * combination with a ternary or other conditional execution to allow to short-
 * circuit more complex implementations for a specific case.
 *
 * Notice that this is a dataLast impl where the function needs to be invoked
 * to get the "do nothing" function.
 *
 * @param value - The constant value that would be returned on every invocation.
 * The value is not copied/cloned on every invocation so care should be taken
 * with mutable objects (like arrays, objects, Maps, etc...).
 * @signature
 *   R.constant(value);
 * @example
 *   R.map([1, 2, 3], R.constant('a')); // => ['a', 'a', 'a']
 *   R.map(
 *     [1, 2, 3],
 *     isDemoMode ? R.add(1) : R.constant(0),
 *   ); // => [2, 3, 4] or [0, 0, 0]
 * @dataLast
 * @category Function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function constant<T>(value: T): (...args: any) => T {
  return () => value;
}
