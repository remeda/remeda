import { purry } from "./purry";

/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @param object - Object to return keys and values of.
 * @signature
 *    R.entries(object)
 *    R.entries.strict(object)
 * @example
 *    R.entries({ a: 1, b: 2, c: 3 }) // => [['a', 1], ['b', 2], ['c', 3]]
 *    R.entries.strict({ a: 1 } as const) // => [['a', 1]] typed Array<['a', 1]>
 *    R.pipe(
 *      { a: 1, b: 2, c: 3 },
 *      entries(),
 *    ); // => [['a', 1], ['b', 2], ['c', 3]]
 *    R.pipe(
 *      { a: 1 } as const,
 *      entries.strict(),
 *    ); // => [['a', 1]] typed Array<['a', 1]>
 * @dataFirst
 * @strict
 * @category Object
 */
export function entries<T>(
  object: Readonly<Record<string, T>>,
): Array<[string, T]>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 *
 * @param object - Object to return keys and values of.
 * @signature
 *    R.entries()(object)
 *    R.entries.strict()(object)
 * @example
 *    R.pipe(
 *      { a: 1, b: 2, c: 3 },
 *      entries(),
 *    ); // => [['a', 1], ['b', 2], ['c', 3]]
 *    R.pipe(
 *      { a: 1 } as const,
 *      entries.strict(),
 *    ); // => [['a', 1]] typed Array<['a', 1]>
 * @dataLast
 * @strict
 * @category Object
 */
export function entries(): <T>(
  object: Readonly<Record<string, T>>,
) => Array<[string, T]>;

export function entries(): unknown {
  return purry(Object.entries, arguments);
}

type Entries<T> = Array<
  { [K in keyof T]-?: [key: K, value: Required<T>[K]] }[keyof T]
>;

type Strict = {
  <T extends NonNullable<unknown>>(object: T): Entries<T>;
  (): <T extends NonNullable<unknown>>(object: T) => Entries<T>;
};

export namespace entries {
  export const strict = entries as Strict;
}
