import type { MergeDeep } from 'type-fest';
import { uniq } from './uniq';
import { isCyclic } from './_isCyclic';

/**
 * Recursively merges two values, `a` and `b`.
 * @param target - The first value to merge. This is the dominant parameter in the merge operation.
 * @param source - The second value to merge.
 */

export function deepMerge<Target, Source>(
  target: Target,
  source: Source
): MergeDeep<Target, Source> {
  // @ts-expect-error temporarily disable type checking
  return _deepMerge(target, source);
}

export function _deepMerge<T>(a: T, b: unknown): T {
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
    if (!isCyclic(a[k])) output[k] = deepMerge(a[k], b[k]);
  }
  return output;
}
