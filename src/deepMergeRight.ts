import { DeepPartialObject, recursiveMerge } from './_recursiveMerge';

/**
 * Merging object from right to left
 *
 * @description
 * @param target value will be replaced if possible.
 * @param source
 * Consider following
 *
 * array + obj = obj
 * obj + array = array
 * obj + obj = obj (recursively merged)
 * array + array = array (removes duplicates using Set)
 * (truthy plain value) + undefined = (truthy plain value)
 * A(truthy plain value) + B(truthy plain value) = B(truthy plain value)
 * Handles circular references
 * @returns {T}
 */
export function deepMergeRight<T extends object>(
  target: DeepPartialObject<T>,
  source: T
): T {
  return recursiveMerge(source, target);
}
