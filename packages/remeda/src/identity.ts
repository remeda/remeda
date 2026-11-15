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
 *    identity();
 * @example
 *    map([1,2,3], identity()); // => [1,2,3]
 * @category Function
 */
export function identity(): IdentityFunction {
  // The exported `identity` returns the identity function instead of being it,
  // so all "Function" utilities share an API where the function is called, not
  // passed as a reference: `identity()` and not `identity`, just like
  // `constant(1)`.
  return identityImplementation;
}

const identityImplementation: IdentityFunction = (firstParameter) =>
  firstParameter;
