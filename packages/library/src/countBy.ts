import { purry } from "./purry";
import type { ExactRecord } from "./internal/types/ExactRecord";

/**
 * Categorize and count elements in an array using a defined callback function.
 * The callback function is applied to each element in the array to determine
 * its category and then counts how many elements fall into each category.
 *
 * @param data - The array.
 * @param categorizationFn - The categorization function.
 * @signature
 *   R.countBy(data, categorizationFn)
 * @example
 *    R.countBy(
 *      ["a", "b", "c", "B", "A", "a"],
 *      R.toLowerCase()
 *    ); //=> { a: 3, b: 2, c: 1 }
 * @dataFirst
 * @category Array
 */
export function countBy<T, K extends PropertyKey>(
  data: ReadonlyArray<T>,
  categorizationFn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => K | undefined,
): ExactRecord<K, number>;

/**
 * Categorize and count elements in an array using a defined callback function.
 * The callback function is applied to each element in the array to determine
 * its category and then counts how many elements fall into each category.
 *
 * @param categorizationFn - The categorization function.
 * @signature
 *   R.countBy(categorizationFn)(data)
 * @example
 *    R.pipe(
 *      ["a", "b", "c", "B", "A", "a"],
 *      R.countBy(R.toLowerCase()),
 *    ); //=> { a: 3, b: 2, c: 1 }
 * @dataLast
 * @category Array
 */
export function countBy<T, K extends PropertyKey>(
  categorizationFn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => K | undefined,
): (data: ReadonlyArray<T>) => ExactRecord<K, number>;

export function countBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(countByImplementation, args);
}

const countByImplementation = <T>(
  data: ReadonlyArray<T>,
  categorizationFn: (
    value: T,
    index: number,
    data: ReadonlyArray<T>,
  ) => PropertyKey | undefined,
): ExactRecord<PropertyKey, number> => {
  const out: ExactRecord<PropertyKey, number> = {};

  for (const [index, item] of data.entries()) {
    const category = categorizationFn(item, index, data);
    if (category !== undefined) {
      out[category] ??= 0;
      out[category] += 1;
    }
  }

  return out;
};
