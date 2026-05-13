import type { KeysOfUnion, Simplify } from "type-fest";
import type { IsBounded } from "./internal/types/IsBounded";
import { purry } from "./purry";

// Arrays route to the `boolean`-returning overload below: their `keyof`
// includes prototype methods (`push`, `pop`, …) that aren't own properties
// at runtime, which would otherwise collapse the predicate's else branch to
// `never`. The leading `extends readonly unknown[]` filter is mirrored on
// both the predicate type and the parameter type so the type-predicate
// assignability check stays satisfied.
type NonArray<T> = T extends readonly unknown[] ? never : T;

type HasProp<T, Key extends PropertyKey> = T extends readonly unknown[]
  ? never
  : // Distribute over `T`'s union members so members that don't have `Key`
    // drop out of the narrowed type.
    T extends unknown
    ? Key extends keyof T
      ? // `T &` makes the result structurally a subtype of `T`, satisfying
        // the type-predicate assignability check.
        Simplify<T & Required<Pick<T, Key>>>
      : never
    : never;

/**
 * Checks if `data` has a prop `key`.
 *
 * Uses [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
 * which only checks own properties, skipping properties inherited through the
 * prototype chain.
 *
 * - Use `prop` to read the value.
 *
 * @param data - The object to test.
 * @param key - The key to look up.
 * @signature
 *   hasProp(data, key)
 * @example
 *   hasProp({ a: 1 }, "a"); //=> true
 * @dataFirst
 * @category Guard
 */
export function hasProp<T extends object, Key extends KeysOfUnion<T>>(
  // Arrays route to the `boolean`-returning overload below: their `keyof`
  // includes prototype methods (`push`, `pop`, …) that aren't own properties
  // at runtime, which would otherwise collapse the predicate's else branch
  // to `never`. Use `hasAtLeast` to narrow array indices and `isArray` to
  // discriminate array vs. object unions.
  data: NonArray<T>,
  // Bounded literal keys narrow; unbounded keys (`string`, template
  // literals, etc.) route to the `boolean`-returning overload below so the
  // predicate doesn't collapse the else-branch to `never`.
  key: IsBounded<Key> extends true ? Key : never,
): data is HasProp<T, Key>;
export function hasProp<T extends object>(
  data: T,
  key: KeysOfUnion<T>,
): boolean;

/**
 * Checks if `data` has a prop `key`.
 *
 * Uses [`Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
 * which only checks own properties, skipping properties inherited through the
 * prototype chain.
 *
 * - Use `prop` to read the value.
 *
 * @param key - The key to look up.
 * @signature
 *   hasProp(key)(data)
 * @example
 *   pipe({ a: 1 }, hasProp("a")); //=> true
 *   filter([] as { a?: number }[], hasProp("a")); //=> typed as { a: number }[]
 * @dataLast
 * @category Guard
 */
export function hasProp<T extends object, Key extends KeysOfUnion<T>>(
  key: IsBounded<Key> extends true ? Key : never,
): (data: NonArray<T>) => data is HasProp<T, Key>;
export function hasProp<T extends object>(
  key: KeysOfUnion<T>,
): (data: T) => boolean;

export function hasProp(...args: readonly unknown[]): unknown {
  return purry(hasPropImplementation, args);
}

function hasPropImplementation<T extends object, Key extends KeysOfUnion<T>>(
  data: T,
  key: Key,
): data is HasProp<T, Key> {
  return Object.hasOwn(data, key);
}
