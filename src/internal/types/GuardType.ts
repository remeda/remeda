/**
 * Extracts a type predicate from a type guard function for the first argument.
 *
 * @example
 * type TypeGuardFn = (x: unknown) => x is string;
 * type Result = GuardType<TypeGuardFn>; // `string`
 */
export type GuardType<T, Fallback = never> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't care about arguments types here
  x: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't care about arguments types here
  ...rest: any
) => x is infer U
  ? U
  : Fallback;
