/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { KeysOfUnion } from "type-fest";
import type { ArrayAt } from "./internal/types/ArrayAt";

type PropDeep<T, K extends ReadonlyArray<unknown>> = K extends readonly [
  infer Head,
  ...infer Rest,
]
  ? PropDeep<Prop<T, Head>, Rest>
  : T;

type Prop<T, K> = T extends unknown
  ? K extends keyof T
    ? T extends ReadonlyArray<unknown>
      ? ArrayAt<T, K>
      : T[K]
    : undefined
  : never;

type NonPropertyKey = Exclude<{}, PropertyKey>;

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
export function prop<T extends NonPropertyKey, Key extends KeysOfUnion<T>>(
  data: T,
  key: Key,
): NoInfer<Prop<T, Key>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
>(data: T, key0: Key0, key1: Key1): NoInfer<PropDeep<T, [Key0, Key1]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
): NoInfer<PropDeep<T, [Key0, Key1, Key2]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
  Key6 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>,
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<PropDeep<T, [Key0]>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
  Key6 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>,
  Key7 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>
  >,
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
  key7: Key7,
): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<PropDeep<T, [Key0]>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
  Key6 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>,
  Key7 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>
  >,
  Key8 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>
  >,
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
  key7: Key7,
  key8: Key8,
): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<PropDeep<T, [Key0]>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
  Key6 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>,
  Key7 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>
  >,
  Key8 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>
  >,
  Key9 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]>
  >,
  AdditionalKeys extends ReadonlyArray<PropertyKey> = [],
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
  key7: Key7,
  key8: Key8,
  key9: Key9,
  ...additionalKeys: AdditionalKeys
): NoInfer<
  PropDeep<
    T,
    [
      Key0,
      Key1,
      Key2,
      Key3,
      Key4,
      Key5,
      Key6,
      Key7,
      Key8,
      Key9,
      ...AdditionalKeys,
    ]
  >
>;

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
export function prop<T extends NonPropertyKey, Key extends KeysOfUnion<T>>(
  key: Key,
): (data: T) => NoInfer<Prop<T, Key>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
>(key0: Key0, key1: Key1): (data: T) => NoInfer<PropDeep<T, [Key0, Key1]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<Prop<T, Key0>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
  Key6 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
): (
  data: T,
) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<PropDeep<T, [Key0]>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
  Key6 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>,
  Key7 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>
  >,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
  key7: Key7,
): (
  data: T,
) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<PropDeep<T, [Key0]>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
  Key6 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>,
  Key7 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>
  >,
  Key8 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>
  >,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
  key7: Key7,
  key8: Key8,
): (
  data: T,
) => NoInfer<
  PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]>
>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysOfUnion<T>,
  Key1 extends KeysOfUnion<PropDeep<T, [Key0]>>,
  Key2 extends KeysOfUnion<PropDeep<T, [Key0, Key1]>>,
  Key3 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2]>>,
  Key4 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3]>>,
  Key5 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>,
  Key6 extends KeysOfUnion<PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>>,
  Key7 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>
  >,
  Key8 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>
  >,
  Key9 extends KeysOfUnion<
    PropDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]>
  >,
  AdditionalKeys extends ReadonlyArray<PropertyKey> = [],
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
  key5: Key5,
  key6: Key6,
  key7: Key7,
  key8: Key8,
  key9: Key9,
  ...additionalKeys: AdditionalKeys
): (
  data: T,
) => NoInfer<
  PropDeep<
    T,
    [
      Key0,
      Key1,
      Key2,
      Key3,
      Key4,
      Key5,
      Key6,
      Key7,
      Key8,
      Key9,
      ...AdditionalKeys,
    ]
  >
>;

export function prop<K extends PropertyKey>(
  key: K,
): <T extends Partial<Record<K, unknown>>>(data: T) => T[K];

export function prop(
  maybeData: NonPropertyKey | PropertyKey,
  ...args: ReadonlyArray<PropertyKey>
): unknown {
  return typeof maybeData === "string" ||
    typeof maybeData === "number" ||
    typeof maybeData === "symbol"
    ? (data: NonPropertyKey) => propImplementation(data, maybeData, ...args)
    : propImplementation(maybeData, ...args);
}

function propImplementation(
  data: NonPropertyKey,
  ...keys: ReadonlyArray<PropertyKey>
): unknown {
  let output: unknown = data;
  for (const key of keys) {
    if (output === undefined || output === null) {
      return;
    }
    // @ts-expect-error [ts7053] -- This is fine, the types are really dynamic
    // here and TypeScript doesn't have a chance to infer them correctly.
    output = output[key];
  }
  return output;
}
