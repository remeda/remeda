import { uniq } from './uniq';
import { isCyclic } from './_isCyclic';

export type DeepPartialArray<T> = ReadonlyArray<DeepPartial<T>>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends Function
  ? T
  : T extends ReadonlyArray<infer U>
  ? DeepPartialArray<U>
  : T extends object
  ? DeepPartialObject<T>
  : unknown;
export type DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Recursively merges two values, `a` and `b`.
 *
 * @param {unknown} a - The first value to merge. This is the dominant parameter in the merge operation.
 * @param {unknown} b - The second value to merge.
 * @returns {unknown} The result of the merge operation.
 */
export function recursiveMerge<T>(a: T, b: unknown): T {
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return a ?? (b as T);
  }
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return uniq(a.concat(b)) as T;
    }
    return a;
  }
  const output = { ...a };
  const keys = uniq(Object.keys(a).concat(Object.keys(b)));
  for (const k of keys) {
    // @ts-expect-error We've already ensured that "a" and "b" are objects at runtime.
    if (!isCyclic(a[k])) output[k] = recursiveMerge(a[k], b[k]);
  }
  return output;
}
