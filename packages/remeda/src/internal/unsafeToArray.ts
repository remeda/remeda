import { isArray } from "../isArray";

/**
 * This function is "unsafe" because it assumes that the input writable if it is
 * an array, meaning it can cast an readonly array to a writable array.
 */
export function unsafeToArray<T>(input: ReadonlyArray<T>): never;
export function unsafeToArray<T>(input: Iterable<T>): Array<T>;
export function unsafeToArray<T>(input: Iterable<T>): Array<T> {
  return isArray(input) ? (input as Array<T>) : [...input];
}
