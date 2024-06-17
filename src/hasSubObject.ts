import type { Simplify } from "type-fest";
import type { Branded } from "./internal/types";
import { isDeepEqual } from "./isDeepEqual";
import { purry } from "./purry";

declare const HAS_SUB_OBJECT_BRAND: unique symbol;

type HasSubObjectGuard<T, S> = Simplify<
  Branded<S & T, typeof HAS_SUB_OBJECT_BRAND>
>;

type HasSubObjectObjectValue<A, B> = Partial<{
  [Key in keyof A & keyof B]: A[Key] & B[Key] extends never
    ? B[Key]
    : A[Key] | B[Key] extends object
      ? HasSubObjectObjectValue<A[Key], B[Key]>
      : A[Key] & B[Key] extends object
        ? B[Key]
        : A[Key];
}> & {
  [Key in
    | Exclude<keyof A, keyof B>
    | Exclude<keyof B, keyof A>]: Key extends keyof B ? B[Key] : never;
};

type HasSubObjectData<
  Data,
  SubObject,
  RData = Required<Data>,
  RSubObject = Required<SubObject>,
> = Partial<{
  [Key in keyof RData & keyof RSubObject]: RData[Key] &
    RSubObject[Key] extends never
    ? RSubObject[Key]
    : RData[Key] | RSubObject[Key] extends object
      ? HasSubObjectObjectValue<RData[Key], RSubObject[Key]>
      : RData[Key] & RSubObject[Key] extends object
        ? RSubObject[Key]
        : RData[Key];
}> & {
  [Key in Exclude<keyof SubObject, keyof Data>]: SubObject[Key];
};

type HasSubObjectSubObject<
  SubObject,
  Data,
  RSubObject = Required<SubObject>,
  RData = Required<Data>,
> = Partial<{
  [Key in keyof RData & keyof RSubObject]: RData[Key] &
    RSubObject[Key] extends never
    ? RData[Key]
    : RData[Key] | RSubObject[Key] extends object
      ? HasSubObjectObjectValue<RSubObject[Key], RData[Key]>
      : RData[Key] & RSubObject[Key] extends object
        ? RData[Key]
        : RSubObject[Key];
}> & {
  [Key in Exclude<keyof SubObject, keyof Data>]: never;
};

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param data - The object to test.
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(data, subObject)
 * @example
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }) //=> true
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { b: 4 }) //=> false
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, {}) //=> true
 * @dataFirst
 * @category Guard
 */
export function hasSubObject<
  T extends Record<PropertyKey, unknown>,
  S extends HasSubObjectSubObject<S, T>,
>(data: T, subObject: S): data is HasSubObjectGuard<T, S>;

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(subObject)(data)
 * @example
 *    R.hasSubObject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasSubObject({ b: 4 })({ a: 1, b: 2, c: 3 }) //=> false
 *    R.hasSubObject({})({ a: 1, b: 2, c: 3 }) //=> true
 * @dataLast
 * @category Guard
 */
export function hasSubObject<S extends Record<PropertyKey, unknown>>(
  subObject: S,
): <T extends HasSubObjectData<T, S>>(
  data: T,
) => data is HasSubObjectGuard<T, S>;

export function hasSubObject(...args: ReadonlyArray<unknown>): unknown {
  return purry(hasSubObjectImplementation, args);
}

function hasSubObjectImplementation<
  T extends Record<PropertyKey, unknown>,
  S extends Record<PropertyKey, unknown>,
>(data: T, subObject: S): data is HasSubObjectGuard<T, S> {
  for (const [key, value] of Object.entries(subObject)) {
    if (!Object.hasOwn(data, key)) {
      return false;
    }

    if (!isDeepEqual(value, data[key])) {
      return false;
    }
  }

  return true;
}
