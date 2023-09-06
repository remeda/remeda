import type { MergeDeep } from 'type-fest';
import { purry } from './purry';

type UnknownRecordOrArray =
  | Record<PropertyKey, unknown>
  | ReadonlyArray<unknown>;

function isRecord(object: unknown): object is UnknownRecordOrArray {
  return (
    typeof object === 'object' &&
    object !== null &&
    Object.getPrototypeOf(object) === Object.prototype
  );
}

/**
 * Recursively merges two values, `a` and `b`.
 * @param target - The first value to merge.
 * @param source - The second value to merge. This is the dominant parameter in the merge operation.
 * @signature
 *    R.mergeDeep(a, b)
 * @example
 *    R.mergeDeep({ foo: 'bar', x: 1 }, { foo: 'baz', y: 2 }) // => { foo: 'bar', x: 1, y: 2 }
 * @data_first
 * @category Object
 * @pipeable
 */
export function mergeDeep<
  Target extends UnknownRecordOrArray,
  Source extends UnknownRecordOrArray
>(
  target: Target,
  source: Source
): MergeDeep<Target, Source, { arrayMergeMode: 'spread' }>;

/**
 * Recursively merges two values, `a` and `b`.
 * @param source - The second value to merge.
 * @signature
 *    R.mergeDeep(b)(a)
 * @example
 *    R.mergeDeep({ foo: 'baz', y: 2 })({ foo: 'bar', x: 1 }) // => { foo: 'bar', x: 1, y: 2 }
 *    R.pipe(
 *      { foo: 'bar', x: 1 },
 *      R.mergeDeep({ foo: 'baz', y: 2 }),
 *    ) // => { foo: 'bar', x: 1, y: 2 }
 * @data_last
 * @category Object
 * @pipeable
 */
export function mergeDeep<
  Target extends UnknownRecordOrArray,
  Source extends UnknownRecordOrArray
>(
  source: Source
): (target: Target) => MergeDeep<Target, Source, { arrayMergeMode: 'spread' }>;

export function mergeDeep() {
  return purry(_mergeDeep, arguments);
}

function _mergeDeep(a: UnknownRecordOrArray, b: UnknownRecordOrArray) {
  const seenValues = new WeakSet(); // use to keep track of which objects have been seen.

  function isArrayCyclic(arr: ReadonlyArray<unknown>) {
    return arr.some(value => value && seenValues.has(value));
  }

  function merge(a: UnknownRecordOrArray, b: UnknownRecordOrArray) {
    if (a === null || b === null) {
      return a ?? b;
    }

    if (seenValues.has(a) || seenValues.has(b)) {
      return a;
    }
    seenValues.add(a);
    seenValues.add(b);

    if (Array.isArray(a)) {
      if (Array.isArray(b)) {
        if (isArrayCyclic(a)) {
          return b;
        }
        if (isArrayCyclic(b)) {
          return a;
        }
        return a.concat(b);
      }
      return b;
    }
    if (Array.isArray(b)) {
      return b;
    }

    // At this point the output is already merged, simply not deeply merged.
    const output = { ...a, ...b };

    // now just scan the output and look for values that should have been deep-merged
    for (const k in b) {
      const aValue = a[k];
      const bValue = b[k];

      if (
        isRecord(aValue) &&
        !seenValues.has(a[k] as object) &&
        isRecord(bValue)
      ) {
        // These are the only keys that need recursive merging. At this point
        // we already know that both of them are objects, so they match the type
        // of _mergeDeep.
        output[k] = _mergeDeep(aValue, bValue);
      }
    }
    return output;
  }
  return merge(a, b);
}
