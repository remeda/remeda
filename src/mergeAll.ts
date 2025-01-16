import type { MergeTuple } from "./internal/types/MergeTuple";

/**
 * Merges a list of objects into a single object.
 *
 * @param array - The array of objects.
 * @signature
 *    R.mergeAll(objects)
 * @example
 *    R.mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }]) // => { a: 1, b: 2, c: 3, d: 10 }
 * @category Array
 */
export function mergeAll<A>(array: readonly [A]): A;
export function mergeAll<A, B>(
  array: readonly [A, B],
): MergeTuple<typeof array>;
export function mergeAll<A, B, C>(
  array: readonly [A, B, C],
): MergeTuple<typeof array>;
export function mergeAll<A, B, C, D>(
  array: readonly [A, B, C, D],
): MergeTuple<typeof array>;
export function mergeAll<A, B, C, D, E>(
  array: readonly [A, B, C, D, E],
): MergeTuple<typeof array>;
export function mergeAll(array: ReadonlyArray<object>): object;

export function mergeAll(items: ReadonlyArray<object>): object {
  let out = {};

  for (const item of items) {
    out = { ...out, ...item };
  }

  return out;
}
