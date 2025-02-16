/**
 * A helper utility to simplify throwing errors as a callback.
 */
// TODO: should this be added to the library?
export function throws(
  message?: string,
): // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- There is no other way to make typescript infer the function arguments "backwards" in data-last invocations without the Args type parameter. @see: https://github.com/typescript-eslint/typescript-eslint/issues/9887
<Args extends ReadonlyArray<unknown>>(...args: Args) => never {
  return () => {
    throw new Error(message);
  };
}
