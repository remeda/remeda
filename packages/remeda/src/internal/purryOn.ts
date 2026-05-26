/**
 * Utility for purrying functions based on a predicate for the first argument.
 *
 * This is useful for purrying functions with an optional parameter or a
 * variadic argument list.
 */
export function purryOn<T>(
  isArg: (firstArg: unknown) => firstArg is T,
  implementation: (data: never, firstArg: T, ...args: never) => unknown,
  args: readonly unknown[],
): unknown {
  return isArg(args[0])
    ? // @ts-expect-error [ts2556] - This is a low-level function that assumes the function declaration and setup is correct and won't result in typing issues when called dynamically.
      (data: unknown) => implementation(data, ...args)
    : // @ts-expect-error [ts2556] - This is a low-level function that assumes the function declaration and setup is correct and won't result in typing issues when called dynamically.
      implementation(...args);
}
