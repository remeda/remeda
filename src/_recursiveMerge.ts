import { uniq } from './uniq';
import { isCyclic } from './_isCyclic';

/**
 * Recursively merges two values, `a` and `b`.
 *
 * @param {unknown} a - The first value to merge. This is the dominant parameter in the merge operation.
 * @param {unknown} b - The second value to merge.
 * @returns {unknown} The result of the merge operation.
 */
export function recursiveMerge(a: unknown, b: unknown): unknown {
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return a ?? b;
  }
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return uniq(a.concat(b));
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
