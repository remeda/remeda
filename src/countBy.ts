import { purry } from "./purry";
import type { ExactRecord } from "./internal/types/ExactRecord";

/**
 * Categorize and count elements in an array using a defined callback function.
 * The transformation function applies to each element in the array to
 * determine its category and then counts how many elements fall into
 * each category.
 *
 * @param data - The array.
 * @param fn - The transformation function.
 * @signature
 *   R.countBy(data, fn)
 * @example
 *    R.countBy(
 *      ["a", "b", "c", "B", "A", "a"],
 *      R.toLowerCase()
 *    ) // { a: 3, b: 2, c: 1 }
 * @dataFirst
 * @category Array
 */
export function countBy<T, K extends PropertyKey>(
  data: ReadonlyArray<T>,
  fn: (value: T, index: number, data: ReadonlyArray<T>) => K | undefined,
): ExactRecord<K, number>;

/**
 * Categorize and count elements in an array using a defined callback function.
 * The transformation function applies to each element in the array to
 * determine its category and then counts how many elements fall into
 * each category.
 *
 * @param fn - The transformation function.
 * @signature
 *   R.countBy(fn)(data)
 * @example
 *    R.pipe(
 *      ["a", "b", "c", "B", "A", "a"],
 *      R.countBy(R.toLowerCase())
 *    ) // { a: 3, b: 2, c: 1 }
 * @dataLast
 * @category Array
 */
export function countBy<T, K extends PropertyKey>(
  fn: (value: T, index: number, data: ReadonlyArray<T>) => K | undefined,
): (data: ReadonlyArray<T>) => ExactRecord<K, number>;

export function countBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(countByImplementation, args);
}

const countByImplementation = <T>(
  data: ReadonlyArray<T>,
  fn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => PropertyKey | undefined,
): ExactRecord<PropertyKey, number> => {
  const out: ExactRecord<PropertyKey, number> = {};

  for (const [index, item] of data.entries()) {
    const key = fn(item, index, data);
    if (key !== undefined) {
      out[key] ??= 0;
      out[key] += 1;
    }
  }

  return out;
};
