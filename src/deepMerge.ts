import type { MergeDeep } from 'type-fest';
import { uniq } from './uniq';
import { isCyclic } from './_isCyclic';
import { purry } from './purry';

/**
 * Recursively merges two values, `a` and `b`.
 * @param target - The first value to merge. This is the dominant parameter in the merge operation.
 * @param source - The second value to merge.
 * @signature
 *    R.deepMerge(a, b)
 * @example
 *    R.deepMerge({ foo: 'bar', x: 1 }, { foo: 'baz', y: 2 }) // => { foo: 'bar', x: 1, y: 2 }
 * @data_first
 * @category Object
 * @pipeable
 */
export function deepMerge<Target, Source>(
  target: Target,
  source: Source
): MergeDeep<Target, Source>;

/**
 * Recursively merges two values, `a` and `b`.
 * @param source - The second value to merge.
 * @signature
 *    R.deepMerge(b)(a)
 * @example
 *    R.deepMerge({ foo: 'baz', y: 2 })({ foo: 'bar', x: 1 }) // => { foo: 'bar', x: 1, y: 2 }
 *    R.pipe(
 *      { foo: 'bar', x: 1 },
 *      R.deepMerge({ foo: 'baz', y: 2 }),
 *    ) // => { foo: 'bar', x: 1, y: 2 }
 * @data_last
 * @category Object
 * @pipeable
 */
export function deepMerge<Target, Source>(
  source: Source
): (target: Target) => MergeDeep<Target, Source>;

export function deepMerge() {
  return purry(_deepMerge, arguments);
}

export function _deepMerge(a: unknown, b: unknown): unknown {
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return a ?? b;
  }
  if (Array.isArray(a)) {
    if (Array.isArray(b) && !isCyclic(a)) {
      return a.concat(b);
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
