//#region src/identity.d.ts
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
declare function identity(): IdentityFunction;
//#endregion
export { identity as t };
//# sourceMappingURL=identity-DXgEf4ug.d.cts.map