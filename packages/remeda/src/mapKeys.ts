/* eslint-disable @typescript-eslint/no-empty-object-type --
 * We want to match the typing of the built-in Object.entries as much as
 * possible!
 */

import type { And, IsUnion, Or } from "type-fest";
import type { EnumerableStringKeyedValueOf } from "./internal/types/EnumerableStringKeyedValueOf";
import type { EnumerableStringKeyOf } from "./internal/types/EnumerableStringKeyOf";
import type { IsBounded } from "./internal/types/IsBounded";
import { purry } from "./purry";

type MappedKeys<T, Key extends PropertyKey> = MaybePartial<
  T,
  Key,
  // We re-key `T` using `Key`, but because we can't infer at the type level
  // how the mapper would map each specific input key we assign all props the
  // same value, made of all possible values of `T`.
  Record<Key, EnumerableStringKeyedValueOf<T>>
>;

/**
 * This type is very similar to `BoundedPartial` simplified to the case where
 * we reconstruct the Record using a known `Key` type.
 *
 * @see BoundedPartial
 */
type MaybePartial<T, Key extends PropertyKey, Output> =
  And<IsBounded<Key>, Or<IsUnion<Key>, CouldBeEmpty<T>>> extends true
    ? // When keys are bounded we need to consider what assurances we can make
      // about the presence of keys in the output; mainly if there is more than
      // one possible result from the mapper (so we can't know what it would
      // return for a specific input, at the type level), or if object itself
      // might be empty and thus also the output object.
      Partial<Output>
    : // If keys are not bounded TypeScript treats the Record as implicitly
      // Partial so we don't need to do that here.
      Output;

/**
 * Types that are extendable by `{}` are also satisfied by an empty object and
 * thus _could be empty_.
 */
type CouldBeEmpty<T> = {} extends T ? true : false;

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
export function mapKeys<T extends {}, Key extends PropertyKey>(
  data: T,
  keyMapper: (
    key: EnumerableStringKeyOf<T>,
    value: EnumerableStringKeyedValueOf<T>,
    data: T,
  ) => Key,
): MappedKeys<T, Key>;

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
export function mapKeys<T extends {}, Key extends PropertyKey>(
  keyMapper: (
    key: EnumerableStringKeyOf<T>,
    value: EnumerableStringKeyedValueOf<T>,
    data: T,
  ) => Key,
): (data: T) => MappedKeys<T, Key>;

export function mapKeys(...args: readonly unknown[]): unknown {
  return purry(mapKeysImplementation, args);
}

function mapKeysImplementation<T extends {}, Key extends PropertyKey>(
  data: T,
  keyMapper: (key: string, value: unknown, data: T) => Key,
): Partial<Record<Key, unknown>> {
  const out: Partial<Record<Key, unknown>> = {};

  for (const [key, value] of Object.entries(data)) {
    const mappedKey = keyMapper(key, value, data);
    out[mappedKey] = value;
  }

  return out;
}
