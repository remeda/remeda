import type { EmptyObject, IsNever, KeysOfUnion } from "type-fest";
import { hasAtLeast } from "./hasAtLeast";
import type { IsBounded } from "./internal/types/IsBounded";
import type { IsBoundedRecord } from "./internal/types/IsBoundedRecord";
import type { PartitionByUnion } from "./internal/types/PartitionByUnion";
import type { SimplifiedWritable } from "./internal/types/SimplifiedWritable";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

type OmitFromArray<T, Keys extends ReadonlyArray<PropertyKey>> =
  // Distribute unions for both object types and key arrays.
  T extends unknown
    ? Keys extends unknown
      ? // The output is always writable because we always create a new object!
        SimplifiedWritable<
          IsNever<Extract<Keys[number], keyof T>> extends true
            ? // When none of the keys belong to T we can short-circuit and
              // simply return T as-is because `omit` would do nothing.
              T
            : IsBoundedRecord<T> extends true
              ? OmitBounded<T, Keys>
              : OmitUnbounded<T, Keys>
        >
      : never
    : never;

type OmitBounded<T, Keys extends ReadonlyArray<PropertyKey>> =
  // We build our output by first considering any key present in the keys array
  // as being omitted. This object would contain all keys that are unaffected at
  // all by this omit operation.
  FixEmpty<Omit<T, Keys[number]>> &
    // But we might be missing keys that are optional in the keys tuple (and
    // thus might not be removed). Because these keys are optional, their props
    // in the output also need to be optional.
    Partial<
      Pick<
        T,
        Exclude<
          // Find all keys that can either be omitted or not, these are all keys
          // in unions in the required parts of the keys tuple (the prefix and
          // the suffix), as well as all keys in the optional parts and the rest
          // item.
          | PartitionByUnion<TupleParts<Keys>["required"]>["union"]
          | TupleParts<Keys>["optional"][number]
          | TupleParts<Keys>["item"]
          | PartitionByUnion<TupleParts<Keys>["suffix"]>["union"],
          // We then need to remove from these any items which *also* are
          // ensured to always exist in the keys tuple, these are the elements
          // of the required parts of the tuple which are singular (not unions).
          | PartitionByUnion<TupleParts<Keys>["required"]>["singular"]
          | PartitionByUnion<TupleParts<Keys>["suffix"]>["singular"]
        >
      >
    >;

/**
 * The built-in `Omit` type doesn't handle unbounded records correctly! When
 * omitting an unbounded key the result should be untouched as we can't tell
 * what got removed, and can't represent an object that had "something" removed
 * from it, but instead it returns `{}`(?!) The same thing applies when a key
 * is only optionally omitted for the same reasons. This is why we don't use
 * `Omit` at all for the unbounded case.
 *
 * @see https://www.typescriptlang.org/play/?#code/C4TwDgpgBAqgdgIwPYFc4BMLqgXigeQFsBLYAHgCUIBjJAJ3TIGdg7i4BzAGigCIALCABshSXgD4eLNp3EBuAFAB6JVDUA9APxA
 */
type OmitUnbounded<T, Keys extends ReadonlyArray<PropertyKey>> = T &
  // Any key we know for sure is being omitted needs to become "impossible" to
  // access; for an unbounded record this means merging it with a bounded record
  // with `never` value for these keys.
  Record<
    Bounded<
      | PartitionByUnion<TupleParts<Keys>["required"]>["singular"]
      | PartitionByUnion<TupleParts<Keys>["suffix"]>["singular"]
    >,
    never
  >;

/**
 * When `Omit` omits **all** keys from a bounded record it results in `{}` which
 * doesn't match what we'd expect to be returned in terms of a useful type as
 * the output of `Omit`.
 */
type FixEmpty<T> = IsNever<keyof T> extends true ? EmptyObject : T;

/**
 * Filter a union of types, leaving only those that are bounded. e.g.,
 * `Bounded<"a" | number>` results in `"a"`.
 */
type Bounded<T> = T extends unknown
  ? IsBounded<T> extends true
    ? T
    : never
  : never;

/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param keys - The property names.
 * @signature
 *    R.omit(keys)(obj);
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.omit(['a', 'd'])) // => { b: 2, c: 3 }
 * @dataLast
 * @category Object
 */
export function omit<T, const Keys extends ReadonlyArray<KeysOfUnion<T>>>(
  keys: Keys,
): (data: T) => OmitFromArray<T, Keys>;

/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @param data - The object.
 * @param keys - The property names.
 * @signature
 *    R.omit(obj, keys);
 * @example
 *    R.omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { b: 2, c: 3 }
 * @dataFirst
 * @category Object
 */
export function omit<T, const Keys extends ReadonlyArray<KeysOfUnion<T>>>(
  data: T,
  keys: Keys,
): OmitFromArray<T, Keys>;

export function omit(...args: ReadonlyArray<unknown>): unknown {
  return purry(omitImplementation, args);
}

function omitImplementation<
  T extends object,
  Keys extends ReadonlyArray<keyof T>,
>(data: T, keys: Keys): OmitFromArray<T, Keys> {
  if (!hasAtLeast(keys, 1)) {
    // No props to omit at all!
    // @ts-expect-error [ts2322] - TypeScript can't connect the fact that the
    // keys array is empty and infer the expected output, and then infer that we
    // return it correctly here.
    return { ...data };
  }

  if (!hasAtLeast(keys, 2)) {
    // Only one prop to omit so we can let the runtime engine deal with
    // removing it efficiently.
    const { [keys[0]]: _omitted, ...remaining } = data;

    // @ts-expect-error [ts2322] - TypeScript can't compute the expected output
    // correctly and then infer that we return it correctly here.
    return remaining;
  }

  // Multiple props to omit so we have to use a loop to omit all of them.
  const out = { ...data };
  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- This is intentional! It is the most effective way to allow the runtime engine to optimize the object without creating excessive copies for every omitted key.
    delete out[key];
  }

  // @ts-expect-error [ts2322] - The type is too complex and TypeScript can't
  // "follow" the iterative algorithm to ensure the output makes sense.
  return out;
}
