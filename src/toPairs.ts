import { purry } from "./purry";

/**
 * Returns an array of key/values of the enumerable properties of an object.
 * @param object - Object to return keys and values of.
 * @signature
 *    R.toPairs(object)
 *    R.toPairs.strict(object)
 * @example
 *    R.toPairs({ a: 1, b: 2, c: 3 }) // => [['a', 1], ['b', 2], ['c', 3]]
 *    R.toPairs.strict({ a: 1 } as const) // => [['a', 1]] typed Array<['a', 1]>
 *    R.pipe(
 *      { a: 1, b: 2, c: 3 },
 *      toPairs,
 *    ); // => [['a', 1], ['b', 2], ['c', 3]]
 *    R.pipe(
 *      { a: 1 } as const,
 *      toPairs.strict,
 *    ); // => [['a', 1]] typed Array<['a', 1]>
 * @dataFirst
 * @strict
 * @category Object
 */
export function toPairs<T>(object: Record<string, T>): Array<[string, T]>;

/**
 * Returns an array of key/values of the enumerable properties of an object.
 * @param object - Object to return keys and values of.
 * @signature
 *    R.toPairs()(object)
 *    R.toPairs.strict()(object)
 * @example
 *    R.pipe(
 *      { a: 1, b: 2, c: 3 },
 *      toPairs(),
 *    ); // => [['a', 1], ['b', 2], ['c', 3]]
 *    R.pipe(
 *      { a: 1 } as const,
 *      toPairs.strict(),
 *    ); // => [['a', 1]] typed Array<['a', 1]>
 * @dataLast
 * @strict
 * @category Object
 */
// TODO: Add this back when we deprecate headless calls in V2 of Remeda. Currently the dataLast overload breaks the typing for the headless version of the function, which is used widely in the wild.
// export function toPairs(): <T>(object: Record<string, T>) => Array<[string, T]>;

export function toPairs() {
  return purry(Object.entries, arguments);
}

type Pairs<T> = Array<
  { [K in keyof T]-?: [key: K, value: Required<T>[K]] }[keyof T]
>;

type Strict = // (): <T extends NonNullable<unknown>>(object: T) => Pairs<T>;
  // TODO: Add this back when we deprecate headless calls in V2 of Remeda. Currently the dataLast overload breaks the typing for the headless version of the function, which is used widely in the wild.
  <T extends NonNullable<unknown>>(object: T) => Pairs<T>;

export namespace toPairs {
  export const strict = toPairs as Strict;
}
