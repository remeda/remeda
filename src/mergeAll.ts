/**
 * Merges a list of objects into a single object.
 * @param array the array of objects
 * @signature
 *    R.mergeAll(objects)
 * @example
 *    R.mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }]) // => { a: 1, b: 2, c: 3, d: 10 }
 * @category Array
 */
export function mergeAll<A>(array: readonly [A]): A;
export function mergeAll<A, B>(array: readonly [A, B]): A & B;
export function mergeAll<A, B, C>(array: readonly [A, B, C]): A & B & C;
export function mergeAll<A, B, C, D>(
  array: readonly [A, B, C, D]
): A & B & C & D;
export function mergeAll<A, B, C, D, E>(
  array: [A, B, C, D, E]
): A & B & C & D & E;
export function mergeAll(array: readonly object[]): object;

export function mergeAll(items: readonly any[]) {
  return items.reduce((acc, x) => ({ ...acc, ...x }), {});
}
