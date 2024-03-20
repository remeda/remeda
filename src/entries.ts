import { purry } from "./purry";
import type { Simplify } from "./type-fest/simplify";

type Entries<T> = Array<
  { [K in keyof T]-?: [key: K, value: Required<T>[K]] }[keyof T]
>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @param object - Object to return keys and values of.
 * @signature
 *    R.entries(object)
 * @example
 *    R.entries({ a: 1 } as const) // => [['a', 1]] typed Array<['a', 1]>
 * @dataFirst
 * @category Object
 */
export function entries<T extends NonNullable<unknown>>(
  object: T,
): Simplify<Entries<T>>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @signature
 *    R.entries()(object)
 * @example
 *    R.pipe(
 *      { a: 1 } as const,
 *      entries(),
 *    ); // => [['a', 1]] typed Array<['a', 1]>
 * @dataLast
 * @category Object
 */
export function entries(): <T extends NonNullable<unknown>>(
  object: T,
) => Simplify<Entries<T>>;

export function entries(): unknown {
  return purry(Object.entries, arguments);
}
