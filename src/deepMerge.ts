import type { MergeDeep } from 'type-fest';
import { isCyclic } from './_isCyclic';
import { purry } from './purry';

type UnknownRecordOrArray = Record<string, unknown> | Array<unknown>;

function isRecordOrArray(object: unknown): object is UnknownRecordOrArray {
  return typeof object === 'object' && object !== null;
}

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
export function deepMerge<
  Target extends UnknownRecordOrArray,
  Source extends UnknownRecordOrArray
>(target: Target, source: Source): MergeDeep<Target, Source>;

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
export function deepMerge<
  Target extends UnknownRecordOrArray,
  Source extends UnknownRecordOrArray
>(source: Source): (target: Target) => MergeDeep<Target, Source>;

export function deepMerge() {
  return purry(_deepMerge, arguments);
}

export function _deepMerge(a: UnknownRecordOrArray, b: UnknownRecordOrArray) {
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
  if (Array.isArray(b)) {
    return a;
  }
  if (Array.isArray(b)) {
    return a;
  }

  // At this point the output is already merged, simply not deeply merged.
  const output = { ...b, ...a };

  // now just scan the output and look for values that should have been deep-merged
  for (const k in b) {
    const aValue = a[k];
    const bValue = b[k];

    if (isRecordOrArray(aValue) && !isCyclic(a[k]) && isRecordOrArray(bValue)) {
      // These are the only keys that need recursive merging. At this point
      // we already know that both of them are objects, so they match the type
      // of _deepMerge.
      output[k] = _deepMerge(aValue, bValue);
    }
  }
  return output;
}
