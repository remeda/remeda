import type { EmptyObject, IsNever, KeysOfUnion, Writable } from "type-fest";
import type { IsUnion } from "type-fest/source/internal";
import type { If } from "./internal/types/If";
import type { IsBounded } from "./internal/types/IsBounded";
import type { IsBoundedRecord } from "./internal/types/IsBoundedRecord";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

type PickFromArray<T, Keys extends ReadonlyArray<KeysOfUnion<T>>> =
  // We distribute unions of inputs so that we compute those cases accurately.
  T extends unknown
    ? Keys extends unknown
      ? If<
          // After distributing the union there could be cases where the keys
          // don't belong to the object at all (e.g.
          // `pick({} as { a: string } | { b: number }, ['a'])`
          // If we simply let the regular "constructive" logic run the
          // resulting type would be `{}` which doesn't behave like an empty
          // object.
          IsNever<Extract<Keys[number], keyof T>>,
          EmptyObject,
          // Our logic uses the internal `Pick` type which preserves
          // readonly-ness of props, but return types in Remeda are always
          // mutable (because they are new objects).
          // An additional advantage of using Writable here is that it
          // implicitly also does what "Simplify" would do (by reconstructing
          // the type), so we don't need to wrap everything with `Simplify` too.
          Writable<
            If<
              // Bounded and unbounded records create very different semantics
              // when constructing the result type. See the docs for
              // `IsBounded`.
              IsBoundedRecord<T>,
              BoundedPickFromArray<T, Keys>,
              UnboundedPickFromArray<T, Keys>
            >
          >
        >
      : never
    : never;

/**
 * For bounded records the keys are always bounded too (because they are a
 * subset of the keys of the record). This allows us to focus on the shape of
 * keys array when constructing the output type.
 */
type BoundedPickFromArray<T, Keys extends ReadonlyArray<KeysOfUnion<T>>> =
  // Single literal elements in the prefix or suffix are always present and
  // could be picked as-is.
  Pick<
    T,
    (
      | ItemsByUnion<TupleParts<Keys>["required"]>["singular"]
      | ItemsByUnion<TupleParts<Keys>["suffix"]>["singular"]
    ) &
      // We intersect the keys with `keyof T` to make sure we only select the
      // keys that relevant for this object of the distributed union.
      keyof T
  > &
    // Everything else in the keys array is optional to allow for it both being
    // in the keys array or not.
    Partial<
      Pick<
        T,
        (
          | ItemsByUnion<TupleParts<Keys>["required"]>["union"]
          // TODO: the optional part of the keys array will always be empty because its impossible to provide the pick function with a tuple with optional elements; this is because optional elements always have an implicit `| undefined` type which breaks the constraint that all keys are `keyof T`. We can lift this restriction by supporting `undefined` in the runtime and relaxing the type constraint to allow it, but this relaxed constraint allows the enables a niche feature (optional tuple elements) at the expense of better type-safety for the more common cases of fixed tuples and arrays. Anyway... if we ever change it, this part of the output type will ensure the output is still correct:
          | TupleParts<Keys>["optional"][number]
          | TupleParts<Keys>["item"]
          | ItemsByUnion<TupleParts<Keys>["suffix"]>["union"]
        ) &
          // We intersect the keys with `keyof T` to make sure we only select
          // the keys that relevant for this object of the distributed union.
          keyof T
      >
    >;

/**
 * When all elements in the keys array are bounded there is an additional
 * criteria we need to check for them, which is if the item represents a
 * **singular** prop (e.g., `["a"]`), or a union of several props (e.g., typed
 * as `["a" | "b"]`); This is because for singular props we can say for certain
 * that the prop would also be present in the output, as-is, because that
 * value is ensured to **always** be in the keys array, but for unions we can
 * only say that these props might, optionally, be present in the output.
 */
type ItemsByUnion<T, Singular = never, Union = never> =
  // T is guaranteed to be a fixed tuple (on optional or rest elements) so this
  // recursion will always terminate exactly when T has been fully consumed.
  T extends readonly [infer Head, ...infer Rest]
    ? If<
        IsUnion<Head>,
        ItemsByUnion<Rest, Singular, Union | Head>,
        ItemsByUnion<Rest, Singular | Head, Union>
      >
    : { singular: Singular; union: Union };

/**
 * The built-in `Pick` is weird when it comes to unbounded records because it
 * reconstructs the output object regardless of the shape of the input:
 * `Pick<Record<string, "world">, "hello">` results in the type
 * `{ hello: "world" }`, but you'd expect it to be optional because we don't
 * know if the record contains a `hello` prop or not. This means that when we
 * know the picked keys would create a bounded record **as output**, we need to
 * manually make the output Partial.
 *
 * See: https://www.typescriptlang.org/play/?#code/PTAEE0HsFcHIBNQFMAeAHJBjALqAGqNpKAEZKigAGA3qABZIA2jkA-AFygBEA7pAE6N4XUAF9KAGlLRcAQ0ayAzgChsATwz5QAXlAAFAJaYA1gB4ASlgHxTi7PwMA7AOZTeAoVwB8bhs0jeANzKIBSgAHqsykA.
 */
type UnboundedPickFromArray<T, Keys extends ReadonlyArray<KeysOfUnion<T>>> = If<
  IsBounded<Keys[number]>,
  // We intersect the keys with `keyof T` to make sure we only select the keys
  // that relevant for this object of the distributed union.
  Partial<Pick<T, Keys[number] & keyof T>>,
  Pick<T, Keys[number] & keyof T>
>;

/**
 * Creates an object composed of the picked `data` properties.
 *
 * @param keys - The property names.
 * @signature R.pick([prop1, prop2])(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @dataLast
 * @category Object
 */
export function pick<
  T extends object,
  const Keys extends ReadonlyArray<keyof T>,
>(keys: Keys): (data: T) => PickFromArray<T, Keys>;

/**
 * Creates an object composed of the picked `data` properties.
 *
 * @param data - The target object.
 * @param keys - The property names.
 * @signature R.pick(object, [prop1, prop2])
 * @example
 *    R.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @dataFirst
 * @category Object
 */
export function pick<
  T extends object,
  const Keys extends ReadonlyArray<KeysOfUnion<T>>,
>(data: T, keys: Keys): PickFromArray<T, Keys>;

export function pick(...args: ReadonlyArray<unknown>): unknown {
  return purry(pickImplementation, args);
}

function pickImplementation<
  T extends object,
  Keys extends ReadonlyArray<keyof T>,
>(object: T, keys: Keys): PickFromArray<T, Keys> {
  const out: Partial<Pick<T, Keys[number]>> = {};
  for (const key of keys) {
    if (key in object) {
      out[key] = object[key];
    }
  }
  // @ts-expect-error [ts2322] - We build the type incrementally, there's no way to make typescript infer that we "finished" building the object and to treat it as such.
  return out;
}
