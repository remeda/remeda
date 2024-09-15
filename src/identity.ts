// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Accept functions with more than a single parameter too, we use `any` because that catches all possible cases.
type IdentityFunction = <T>(firstParameter: T, ...rest: any) => T;

/**
 * A function that returns the first argument passed to it.
 *
 * Notice that this is a dataLast impl where the function needs to be invoked
 * to get the "do nothing" function.
 *
 * See also:
 * * `doNothing` - A function that doesn't return anything.
 * * `constant` - A function that ignores the input arguments and returns the same value on every invocation.
 *
 * @signature
 *    R.identity();
 * @example
 *    R.map([1,2,3], R.identity()); // => [1,2,3]
 * @category Function
 */
export const identity = (): IdentityFunction =>
  // Notice that the exported identity function is just the "factory" for the
  // identity function. We do it this way so that all "Function" utilities have
  // a similar API where the function is called, and not just used "headless".
  // e.g. `identity()` and not `identity`, just like the API for `constant(1)`.
  identityImplementation;

const identityImplementation: IdentityFunction = (firstParameter) =>
  firstParameter;
