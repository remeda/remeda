/**
 * A function that takes any arguments and does nothing with them. This is
 * useful as a placeholder for any function or API that requires a **void**
 * function (a function that doesn't return a value). This could also be used in
 * combination with a ternary or other conditional execution to allow disabling
 * a function call for a specific case.
 *
 * Notice that this is a dataLast impl where the function needs to be invoked
 * to get the "do nothing" function.
 *
 * See also:
 * * `constant` - A function that ignores it's arguments and returns the same value on every invocation.
 * * `identity` - A function that returns the first argument it receives.
 *
 * @signature
 *   R.doNothing();
 * @example
 *   myApi({ onSuccess: handleSuccess, onError: R.doNothing() });
 *   myApi({ onSuccess: isDemoMode ? R.doNothing(): handleSuccess });
 * @dataLast
 * @category Function
 */
export function doNothing(): (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any
) => void {
  // Because the function does nothing we safely return the same function
  // (pointer) and don't need to create a new one on every invocation.
  return doesNothing;
}

function doesNothing(): void {
  /* do nothing */
}
