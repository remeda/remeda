import type { BoundedPartial } from "./internal/types/BoundedPartial";
import { purry } from "./purry";

/**
 * Categorize and count elements in an array using a defined callback function.
 * The callback function is applied to each element in the array to determine
 * its category and then counts how many elements fall into each category.
 *
 * @param data - The array.
 * @param categorizationFn - The categorization function.
 * @signature
 *   countBy(data, categorizationFn)
 * @example
 *    countBy(
 *      ["a", "b", "c", "B", "A", "a"],
 *      toLowerCase()
 *    ); //=> { a: 3, b: 2, c: 1 }
 * @dataFirst
 * @category Array
 */
export function countBy<T, K extends PropertyKey>(
  data: readonly T[],
  categorizationFn: (
    value: T,
    index: number,
    data: readonly T[],
  ) => K | undefined,
): BoundedPartial<Record<K, number>>;

/**
 * Categorize and count elements in an array using a defined callback function.
 * The callback function is applied to each element in the array to determine
 * its category and then counts how many elements fall into each category.
 *
 * @param categorizationFn - The categorization function.
 * @signature
 *   countBy(categorizationFn)(data)
 * @example
 *    pipe(
 *      ["a", "b", "c", "B", "A", "a"],
 *      countBy(toLowerCase()),
 *    ); //=> { a: 3, b: 2, c: 1 }
 * @dataLast
 * @category Array
 */
export function countBy<T, K extends PropertyKey>(
  categorizationFn: (
    value: T,
    index: number,
    data: readonly T[],
  ) => K | undefined,
): (data: readonly T[]) => BoundedPartial<Record<K, number>>;

export function countBy(...args: readonly unknown[]): unknown {
  return purry(countByImplementation, args);
}

const countByImplementation = <T>(
  data: readonly T[],
  categorizationFn: (
    value: T,
    index: number,
    data: readonly T[],
  ) => PropertyKey | undefined,
): BoundedPartial<Record<PropertyKey, number>> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- `Object.create` is typed as returning `any`. Without a prototype the object only has the keys *we* add to it, so a category such as `toString` or `__proto__` is counted like any other.
  const out: Record<PropertyKey, number> = Object.create(null);

  for (const [index, item] of data.entries()) {
    const category = categorizationFn(item, index, data);
    if (category !== undefined) {
      // Counted per property key, so the categories that share one (e.g., `1`
      // and `"1"`) share its count.
      out[category] = (out[category] ?? 0) + 1;
    }
  }

  // Set the prototype as if the object was created as a normal one (e.g.,
  // `{}`), so the built-in object methods work on it.
  Object.setPrototypeOf(out, Object.prototype);

  return out;
};
