import type { EmptyObject, IsNever, KeysOfUnion, Writable } from "type-fest";
import type { If } from "./internal/types/If";
import type { IsBounded } from "./internal/types/IsBounded";
import type { IsBoundedRecord } from "./internal/types/IsBoundedRecord";
import type { IsUnion } from "./internal/types/IsUnion";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

type PickFromArray<T, Keys extends ReadonlyArray<KeysOfUnion<T>>> =
  // Distribute unions for both object types and key arrays.
  T extends unknown
    ? Keys extends unknown
      ? If<
          // When T is a union (or when Keys is empty) the picked props might
          // not exist in some of its sub-types, e.g.,
          //   `pick(... as { a: string } | { b: number }, ['a'])`,
          // if we simply let the regular "constructive" logic run, the
          // resulting type would be `{}` which doesn't behave like an empty
          // object; instead, we want to use a more explicit *empty* type.
          IsNever<Extract<Keys[number], keyof T>>,
          EmptyObject,
          // Remove readonly modifiers from picked props since we return a new,
          // mutable, object. Additionally, we usually wrap our types with
          // `Simplify` to flatten any complex types, but Writable does that
          // for us here.
          Writable<
            If<
              IsBoundedRecord<T>,
              BoundedPickFromArray<T, Keys>,
              UnboundedPickFromArray<T, Keys>
            >
          >
        >
      : never
    : never;

/**
 * Bounded records have bounded keys and result in a bounded output. We rely on
 * the shape of the keys array to determine which keys are guaranteed and which
 * are optional.
 */
type BoundedPickFromArray<T, Keys extends ReadonlyArray<KeysOfUnion<T>>> =
  // Literal keys in the prefix/suffix are guaranteed present.
  Pick<
    T,
    Extract<
      | ItemsByUnion<TupleParts<Keys>["required"]>["singular"]
      | ItemsByUnion<TupleParts<Keys>["suffix"]>["singular"],
      // When T is a union the keys need to be narrowed to just those that are
      // keys of the specific sub-type being built
      keyof T
    >
  > &
    // Union keys, optional elements, and rest elements are optional.
    Partial<
      Pick<
        T,
        Extract<
          | ItemsByUnion<TupleParts<Keys>["required"]>["union"]
          // TODO: the optional part of the keys array will always be empty because its impossible to provide the pick function with a tuple with optional elements; this is because optional elements are always implicitly `undefined` too; which breaks the constraint that all keys are keys of T (`undefined` is not a key of anything). We can lift this restriction by supporting `undefined` in the runtime and relaxing the type constraint to allow it, but this relaxed constraint enables a niche feature (optional tuple elements) at the expense of better type-safety for the more common cases of fixed tuples and arrays. Anyway... if we ever change it, this part of the output type will ensure the output is still correct:
          | TupleParts<Keys>["optional"][number]
          | TupleParts<Keys>["item"]
          | ItemsByUnion<TupleParts<Keys>["suffix"]>["union"],
          // When T is a union the keys need to be narrowed to just those that
          // are keys of the specific sub-type being built.
          keyof T
        >
      >
    >;

/**
 * We split the fixed tuple item types into **singular** props (e.g., `"a"`),
 * and unions of several props (e.g., `"a" | "b"`). Singular props are ensured
 * to **always** be in the keys array, and thus always be picked in the
 * output, as-is. Unions define a softer constraint, that their members are
 * only optionally present in the keys array, and thus should also be optional
 * in the output type.
 *
 * We assume that T is a fixed tuple (no optional or rest elements), and that
 * all elements in it are bounded (as defined by `IsBounded`).
 */
type ItemsByUnion<T, Singular = never, Union = never> = T extends readonly [
  infer Head,
  ...infer Rest,
]
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
  // When T is a union the keys need to be narrowed to just those that are keys
  // of the specific sub-type being built.
  Partial<Pick<T, Extract<Keys[number], keyof T>>>,
  Pick<T, Extract<Keys[number], keyof T>>
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
  const Keys extends ReadonlyArray<KeysOfUnion<T>>,
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
