import { purry } from "./purry";

/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param value - The object value.
 * @param key - The property name.
 * @signature
 *    R.objOf(value, key)
 * @example
 *    R.objOf(10, 'a') // => { a: 10 }
 * @category Object
 */
export function objOf<T, K extends string>(value: T, key: K): Record<K, T>;

/**
 * Creates an object containing a single `key:value` pair.
 *
 * @param key - The property name.
 * @signature
 *    R.objOf(key)(value)
 * @example
 *    R.pipe(10, R.objOf('a')) // => { a: 10 }
 * @category Object
 */
export function objOf<T, K extends string>(key: K): (value: T) => Record<K, T>;

export function objOf(...args: ReadonlyArray<unknown>): unknown {
  return purry(objOfImplementation, args);
}

const objOfImplementation = <T, K extends string>(
  value: T,
  key: K,
): Record<K, T> =>
  // @ts-expect-error [ts2322] - I'm not sure how to get the type right here...
  ({ [key]: value });
