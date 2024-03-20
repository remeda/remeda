/* eslint-disable @typescript-eslint/ban-types --
 * We want to match the typing of the built-in Object.entries as much as
 * possible!
 */

import type { ExactRecord } from "./_types";
import { entries } from "./entries";
import { purry } from "./purry";

/**
 * Maps keys of `object` and keeps the same values.
 *
 * @param data - The object to map.
 * @param keyMapper - The mapping function.
 * @signature
 *    R.mapKeys(object, fn)
 * @example
 *    R.mapKeys({a: 1, b: 2}, (key, value) => key + value) // => { a1: 1, b2: 2 }
 * @dataFirst
 * @category Object
 */
export function mapKeys<T extends {}, S extends PropertyKey>(
  data: T,
  keyMapper: (key: keyof T, value: Required<T>[keyof T]) => S,
): ExactRecord<S, T[keyof T]>;

/**
 * Maps keys of `object` and keeps the same values.
 *
 * @param keyMapper - The mapping function.
 * @signature
 *    R.mapKeys(fn)(object)
 * @example
 *    R.pipe({a: 1, b: 2}, R.mapKeys((key, value) => key + value)) // => { a1: 1, b2: 2 }
 * @dataLast
 * @category Object
 */
export function mapKeys<T extends {}, S extends PropertyKey>(
  keyMapper: (key: keyof T, value: Required<T>[keyof T]) => S,
): (data: T) => ExactRecord<S, T[keyof T]>;

export function mapKeys(): unknown {
  return purry(mapKeysImplementation, arguments);
}

function mapKeysImplementation<T extends {}, S extends PropertyKey>(
  data: T,
  keyMapper: (key: keyof T, value: Required<T>[keyof T]) => S,
): ExactRecord<S, T[keyof T]> {
  const out: Partial<Record<S, T[keyof T]>> = {};

  for (const [key, value] of entries(data)) {
    // @ts-expect-error [ts2345] - Adding `Simplify` to the type of `EntryOf` takes away Typescripts ability to infer that the types match. Because we trust `Simplify` to only change how the type "looks" and not its semantics, we need to suppress the error.
    const mappedKey = keyMapper(key, value);
    out[mappedKey] = value;
  }

  return out as ExactRecord<S, T[keyof T]>;
}
