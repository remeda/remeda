import { clone } from './clone';
import { recursiveMerge } from './_recursiveMerge';

export type DeepPartialArray<T> = Array<DeepPartial<T>>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? DeepPartialArray<U>
  : T extends object
  ? DeepPartialObject<T>
  : T | undefined;
export type DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Merging object from left to right
 *
 * @description
 * @param target value be preserved if possible.
 * @param sources
 * Consider following
 *
 * array + obj = array
 * obj + array = obj
 * obj + obj = obj (recursively merged)
 * array + array = array (removes duplicates using Set)
 * (truthy plain value) + ob = (truthy plain value)
 * (truthy plain value) + undefined = (truthy plain value)
 * A(truthy plain value) + B(truthy plain value) = A(truthy plain value)
 *
 * Handles circular references
 * @returns {T}
 */
export function deepMergeLeft<T extends object>(
  target: T,
  ...sources: Array<DeepPartialObject<T>>
): T {
  let output = { ...target } as unknown;
  for (const source of sources) {
    output = recursiveMerge(output, source);
  }
  return output as any;
}

/**
 * Merging object from right to left
 *
 * @description
 * @param target value will be replaced if possible.
 * @param sources
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
  target: T,
  ...sources: Array<DeepPartialObject<T>>
): T {
  let output = clone(target) as unknown;
  for (const source of sources) {
    // Only difference from mergeDeepLeft
    // That source go first and output last
    output = recursiveMerge(source, output);
  }
  return output as any;
}
