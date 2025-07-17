import type { ArrayIndices, KeysOfUnion } from "type-fest";
import { purry } from "./purry";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { TupleParts } from "./internal/types/TupleParts";
import type { ClampedIntegerSubtract } from "./internal/types/ClampedIntegerSubtract";
import type { IntRangeInclusive } from "./internal/types/IntRangeInclusive";

/**
 * Gets the value of the given property.
 *
 * @param data - The object to extract the prop from.
 * @param key - The key of the property to extract.
 * @signature
 *   R.prop(data, key);
 * @example
 *   R.prop({ foo: 'bar' }, 'foo'); // => 'bar'
 * @dataFirst
 * @category Object
 */
export function prop<T, K extends KeysOfUnion<T>>(
  data: T,
  key: K,
): T extends unknown ? (K extends keyof T ? T[K] : undefined) : never;

/**
 * Gets the value of the given property.
 *
 * @param key - The key of the property to extract.
 * @signature
 *   R.prop(key)(data);
 * @example
 *    R.pipe({foo: 'bar'}, R.prop('foo')) // => 'bar'
 * @dataLast
 * @category Object
 */
export function prop<T, K extends KeysOfUnion<T>>(
  key: K,
): (
  data: T,
) => T extends unknown ? (K extends keyof T ? T[K] : undefined) : never;

export function prop<K extends PropertyKey>(
  key: K,
): <T extends Partial<Record<K, unknown>>>(data: T) => T[K];

export function prop(...args: ReadonlyArray<unknown>): unknown {
  return purry(propImplementation, args);
}

const propImplementation = <T, K extends keyof T>(data: T, key: K): T[K] =>
  data[key];
