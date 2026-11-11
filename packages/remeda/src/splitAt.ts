import { purry2 } from "./internal/purryByArity";

/**
 * Splits a given array at a given index.
 *
 * @param data - The array to split.
 * @param index - The index to split at.
 * @signature
 *    splitAt(data, index)
 * @example
 *    splitAt([1, 2, 3], 1) // => [[1], [2, 3]]
 *    splitAt([1, 2, 3, 4, 5], -1) // => [[1, 2, 3, 4], [5]]
 * @dataFirst
 * @category Array
 */
export function splitAt<T>(data: readonly T[], index: number): [T[], T[]];

/**
 * Splits a given array at a given index.
 *
 * @param index - The index to split at.
 * @signature
 *    splitAt(index)(data)
 * @example
 *    splitAt(1)([1, 2, 3]) // => [[1], [2, 3]]
 *    splitAt(-1)([1, 2, 3, 4, 5]) // => [[1, 2, 3, 4], [5]]
 * @dataLast
 * @category Array
 */
export function splitAt<T>(index: number): (data: readonly T[]) => [T[], T[]];

export function splitAt(dataOrIndex: unknown, index?: unknown): unknown {
  return purry2(splitAtImplementation, arguments.length, dataOrIndex, index);
}

function splitAtImplementation<T>(
  data: readonly T[],
  index: number,
): [T[], T[]] {
  const effectiveIndex = Math.max(
    Math.min(index < 0 ? data.length + index : index, data.length),
    0,
  );
  return [data.slice(0, effectiveIndex), data.slice(effectiveIndex)];
}
