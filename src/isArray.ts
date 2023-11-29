type IfIsAny<T, Then, Else> = 0 extends 1 & T ? Then : Else;

type DefinitelyArray<T> = Extract<
  T,
  Array<any> | ReadonlyArray<any>
> extends never
  ? ReadonlyArray<unknown>
  : Extract<T, Array<any> | ReadonlyArray<any>>;
/**
 * A function that checks if the passed parameter is an Array and narrows its type accordingly
 * @param data the variable to check
 * @signature
 *    R.isArray(data)
 * @returns true if the passed input is an Array, false otherwise
 * @example
 *    R.isArray([5]) //=> true
 *    R.isArray([]) //=> true
 *    R.isArray('somethingElse') //=> false
 * @category Guard
 */
export function isArray<T>(
  data: T | ReadonlyArray<unknown>
): data is (IfIsAny<T, ReadonlyArray<unknown>, DefinitelyArray<T>>) {
  return Array.isArray(data);
}

