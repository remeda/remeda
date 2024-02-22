/**
 * Utility for purrying functions based on a predicate for the first argument.
 *
 * This is useful for purrying functions with a variadic argument list.
 */
export function purryOn<T>(
  isArg: (firstArg: unknown) => firstArg is T,
  implementation: (
    firstArg: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Function inference in typescript relies on `any` to work, it doesn't work with `unknown`
    ...args: Array<any>
  ) => unknown,
  args: IArguments
): unknown {
  const callArgs = Array.from(args);
  const [dataOrArg, ...rest] = callArgs;
  return isArg(dataOrArg)
    ? (data: T) => implementation(data, ...callArgs)
    : implementation(dataOrArg, ...rest);
}
