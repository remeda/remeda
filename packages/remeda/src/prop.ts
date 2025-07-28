import type { KeysOfUnion } from "type-fest";
import type { ArrayAt } from "./internal/types/ArrayAt";
import type { NoInfer } from "./internal/types/NoInfer";

// Computes all possible keys of `T` at `Path` spread over unions, allowing
// keys from any of the results, not just those **shared** by all of them.
type KeysDeep<T, Path extends ReadonlyArray<unknown>> = KeysOfUnion<
  PropDeep<T, Path>
>;

// Recursively run `Prop` over `Path` to extract the deeply nested type.
type PropDeep<T, Path extends ReadonlyArray<unknown>> = Path extends readonly [
  infer Key,
  ...infer Rest,
]
  ? PropDeep<Prop<T, Key>, Rest>
  : // Keys is a fixed tuple so we know we reach here only when we've reached
    // the output object.
    T;

// Expanding on the built-in `T[Key]` operator to support arrays and unions.
type Prop<T, Key> =
  // Distribute the union to support unions of keys.
  T extends unknown
    ? // In a distributed union some of the union members might not be keys of a
      // specific object within a union of objects, those cases don't contribute
      // to the output type.
      Key extends keyof T
      ? T extends ReadonlyArray<unknown>
        ? ArrayAt<T, Key>
        : T[Key]
      : undefined
    : never;

// Currying relies on us being able to differentiate between data-first and
// data-last invocations at runtime, but because the function takes a variadic
// array of keys we can't rely on it's shape or length to do that. Instead, we
// can limit the types we accept for `data` so that looking at the first
// parameter's type is enough to make the call. From a practical standpoint
// this means we accept in any `object`, `null,` or `undefined`, and that we
// don't accept `string`. All other types (`boolean` and `bigint`) don't
// have properties, so are incompatible with our `key` parameters anyway.
type NonPropertyKey = object | null | undefined;

/**
 * Gets the value of the given property from an object. Nested properties can
 * be accessed by providing a variadic array of keys that define the path from
 * the root to the desired property. Arrays can be accessed by using numeric
 * keys. Unions and optional properties are handled gracefully by returning
 * `undefined` early for any non-existing property on the path. Paths are
 * validated against the object type to provide stronger type safety, better
 * compile-time errors, and to enable autocompletion in IDEs.
 *
 * @param data - The object or array to access.
 * @param key - The key(s) for the property to extract.
 * @signature
 *   R.prop(data, ...keys);
 * @example
 *   R.prop({ foo: { bar: 'baz' } }, 'foo'); //=> { bar: 'baz' }
 *   R.prop({ foo: { bar: 'baz' } }, 'foo', 'bar'); //=> 'baz'
 *   R.prop(["cat", "dog"], 1); //=> 'dog'
 * @dataFirst
 * @category Object
 */
export function prop<T extends NonPropertyKey, Key extends KeysDeep<T, []>>(
  data: T,
  key: Key,
): NoInfer<Prop<T, Key>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
>(data: T, key0: Key0, key1: Key1): NoInfer<PropDeep<T, [Key0, Key1]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
): NoInfer<PropDeep<T, [Key0, Key1, Key2]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
>(
  data: T,
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
): NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
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
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
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
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
  Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>,
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
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
  Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>,
  Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>,
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
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
  Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>,
  Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>,
  Key8 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>,
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
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
  Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>,
  Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>,
  Key8 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>,
  Key9 extends KeysDeep<
    T,
    [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]
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
 * Gets the value of the given property from an object. Nested properties can
 * be accessed by providing a variadic array of keys that define the path from
 * the root to the desired property. Arrays can be accessed by using numeric
 * keys. Unions and optional properties are handled gracefully by returning
 * `undefined` early for any non-existing property on the path. Paths are
 * validated against the object type to provide stronger type safety, better
 * compile-time errors, and to enable autocompletion in IDEs.
 *
 * @param key - The key(s) for the property to extract.
 * @signature
 *   R.prop(...keys)(data);
 * @example
 *   R.pipe({ foo: { bar: 'baz' } }, R.prop('foo')); //=> { bar: 'baz' }
 *   R.pipe({ foo: { bar: 'baz' } }, R.prop('foo', 'bar')); //=> 'baz'
 *   R.pipe(["cat", "dog"], R.prop(1)); //=> 'dog'
 * @dataLast
 * @category Object
 */
export function prop<T extends NonPropertyKey, Key extends KeysOfUnion<T>>(
  key: Key,
): (data: T) => NoInfer<Prop<T, Key>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
>(key0: Key0, key1: Key1): (data: T) => NoInfer<PropDeep<T, [Key0, Key1]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
>(
  key0: Key0,
  key1: Key1,
  key2: Key2,
  key3: Key3,
  key4: Key4,
): (data: T) => NoInfer<PropDeep<T, [Key0, Key1, Key2, Key3, Key4]>>;
export function prop<
  T extends NonPropertyKey,
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
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
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
  Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>,
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
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
  Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>,
  Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>,
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
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
  Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>,
  Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>,
  Key8 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>,
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
  Key0 extends KeysDeep<T, []>,
  Key1 extends KeysDeep<T, [Key0]>,
  Key2 extends KeysDeep<T, [Key0, Key1]>,
  Key3 extends KeysDeep<T, [Key0, Key1, Key2]>,
  Key4 extends KeysDeep<T, [Key0, Key1, Key2, Key3]>,
  Key5 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4]>,
  Key6 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5]>,
  Key7 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6]>,
  Key8 extends KeysDeep<T, [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7]>,
  Key9 extends KeysDeep<
    T,
    [Key0, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8]
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
      return undefined;
    }
    // @ts-expect-error [ts7053] -- This is fine, the types are really dynamic
    // here and TypeScript doesn't have a chance to infer them correctly.
    output = output[key];
  }
  return output;
}
