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
export function doNothing(): typeof doesNothing {
  // Notice that the exported identity function is just the "factory" for the
  // function. We do it this way so that all "Function" utilities have a similar
  // API where the function is called, and not just used "headless". e.g.
  // `doNothing()` and not `doNothing`, just like the API for `constant(1)`.
  return doesNothing;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- There is no other way to make typescript infer the function arguments "backwards" in data-last invocations without the Args type parameter. @see: https://github.com/typescript-eslint/typescript-eslint/issues/9887
function doesNothing<Args extends ReadonlyArray<unknown>>(
  ..._args: Args
): void {
  /* do nothing */
}
