import { type Simplify } from "type-fest";
import { type EnumeratedKeyOf, type EnumeratedValueOf } from "./_types";
import { purry } from "./purry";

// Symbols are not passed to the predicate (because they can't be enumerated
// with the `Object.entries` function) and the output object is built from a
// shallow copy of the input; meaning symbols would just be passed through as-
// is.
type PickSymbolKeys<T extends object> = {
  -readonly [P in keyof T as P extends symbol ? P : never]: T[P];
};

// When we don't use a type-predicate we can't say anything about what props
// would be omitted from the output, so we need to assume any of them could be
// filtered out. This means that we effectively make all (enumerable) keys
// optional.
type PartialEnumerableKeys<T extends object> = Simplify<
  PickSymbolKeys<T> & {
    -readonly [P in keyof T as P extends symbol ? never : P]?: Required<T>[P];
  }
>;

// When the predicate is a type-guard we have more information to work with when
// constructing the type of the output object. We can safely remove any property
// which value would always be true for the predicate, AND we can also
// assume that properties that are rejected by the predicate perfectly would
// **always** show up in the output object. Hence to build the output object we
// need to build and merge 2 output objects: One for the properties which have a
// value of at type that would always yield a `false` result from the predicate,
// these are the "matches", which would not change the "optionality" of the
// input object's props, and one for partial matches which would also make the
// props optional (as they could have a value that would be filtered out).
type PartialEnumerableKeysNarrowed<T extends object, S> = Simplify<
  PickSymbolKeys<T> & {
    // The exact case, props here would always be part of the output object
    -readonly [P in keyof T as PropIsExact<T, P, S>]: Exclude<T[P], S>;
  } & {
    // The partial case, props here might be part of the output object, but
    // might not be, hence they are optional.
    -readonly [P in keyof T as PropIsPartially<T, P, S>]?: Exclude<T[P], S>;
  }
>;

// If the input object's value type extends itself when the type-guard is
// excluded from it we can safely assume that the predicate would always return
// `false` for any value of that property.
type PropIsExact<T, P extends keyof T, S> =
  T[P] extends Exclude<T[P], S> ? P : never;

// ...and if the input object's value type isn't an exact match, but still has
// some partial match (i.g. the extracted type-guard isn't completely disjoint)
// then we can assume that the property can sometimes return true, and sometimes
// false when passed to the predicate, hence it should be optional in the
// output.
type PropIsPartially<T, P extends keyof T, S> =
  T[P] extends Exclude<T[P], S>
    ? // This is the exact case, we address it above
      never
    : Exclude<Required<T>[P], S> extends never
      ? never
      : P;

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 *
 * @param data - The target object.
 * @param predicate - The predicate.
 * @signature R.omitBy(object, fn)
 * @example
 *    R.omitBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key) // => {a: 1, b: 2}
 * @dataFirst
 * @category Object
 */
export function omitBy<T extends object, S extends EnumeratedValueOf<T>>(
  data: T,
  predicate: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => value is S,
): PartialEnumerableKeysNarrowed<T, S>;
export function omitBy<T extends object>(
  data: T,
  predicate: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => boolean,
): PartialEnumerableKeys<T>;

/**
 * Returns a partial copy of an object omitting the keys matching predicate.
 *
 * @param predicate - The predicate.
 * @signature R.omitBy(fn)(object)
 * @example
 *    R.omitBy((val, key) => key.toUpperCase() === key)({a: 1, b: 2, A: 3, B: 4}) // => {a: 1, b: 2}
 * @dataLast
 * @category Object
 */
export function omitBy<T extends object, S extends EnumeratedValueOf<T>>(
  predicate: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => value is S,
): (data: T) => PartialEnumerableKeysNarrowed<T, S>;
export function omitBy<T extends object>(
  predicate: (
    value: EnumeratedValueOf<T>,
    key: EnumeratedKeyOf<T>,
    data: T,
  ) => boolean,
): (data: T) => PartialEnumerableKeys<T>;

export function omitBy(...args: ReadonlyArray<unknown>): unknown {
  return purry(omitByImplementation, args);
}

function omitByImplementation<T extends object>(
  data: T,
  predicate: (value: unknown, key: string, data: T) => boolean,
): Record<string, unknown> {
  const out: Partial<Record<string, unknown>> = { ...data };

  for (const [key, value] of Object.entries(out)) {
    if (predicate(value, key, data)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- This is the best way to do it!
      delete out[key];
    }
  }

  return out;
}
